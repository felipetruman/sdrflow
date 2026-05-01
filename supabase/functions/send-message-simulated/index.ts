import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { messageId } = await req.json()
    if (!messageId) {
      return new Response(JSON.stringify({ error: 'Missing messageId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch message with lead
    const { data: message, error: msgError } = await supabase
      .from('generated_messages')
      .select('*, leads(*)')
      .eq('id', messageId)
      .single()

    if (msgError || !message) {
      return new Response(JSON.stringify({ error: 'Message not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const lead = (message as any).leads
    if (!lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate workspace membership
    const { data: member } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', lead.workspace_id)
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Block if already sent
    if (message.status === 'sent') {
      return new Response(JSON.stringify({ error: 'Message already sent' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Mark as sent
    const { error: updateError } = await supabase
      .from('generated_messages')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', messageId)

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Find "Tentando Contato" stage
    const { data: targetStage } = await supabase
      .from('funnel_stages')
      .select('id')
      .eq('workspace_id', lead.workspace_id)
      .eq('name', 'Tentando Contato')
      .single()

    if (targetStage && targetStage.id !== lead.stage_id) {
      await supabase
        .from('leads')
        .update({ stage_id: targetStage.id, updated_at: new Date().toISOString() })
        .eq('id', lead.id)

      await supabase.from('lead_activities').insert({
        lead_id: lead.id,
        workspace_id: lead.workspace_id,
        type: 'stage_changed',
        metadata: { from_stage_id: lead.stage_id, to_stage_id: targetStage.id, reason: 'message_sent' },
      })
    }

    // Register message sent activity
    await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      workspace_id: lead.workspace_id,
      type: 'message_sent',
      metadata: { message_id: messageId, campaign_id: message.campaign_id },
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
