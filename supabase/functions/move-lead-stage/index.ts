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

    const { leadId, stageId } = await req.json()
    if (!leadId || !stageId) {
      return new Response(JSON.stringify({ error: 'Missing leadId or stageId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch target stage
    const { data: targetStage, error: stageError } = await supabase
      .from('funnel_stages')
      .select('*')
      .eq('id', stageId)
      .single()

    if (stageError || !targetStage) {
      return new Response(JSON.stringify({ error: 'Stage not found' }), {
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

    // Validate stage belongs to same workspace
    if (targetStage.workspace_id !== lead.workspace_id) {
      return new Response(JSON.stringify({ error: 'Stage does not belong to workspace' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check required fields for target stage
    const { data: requiredFields } = await supabase
      .from('stage_required_fields')
      .select('*')
      .eq('stage_id', stageId)
      .eq('workspace_id', lead.workspace_id)

    const missingFields: string[] = []

    if (requiredFields && requiredFields.length > 0) {
      for (const req of requiredFields) {
        if (req.is_custom_field) {
          const { data: cv } = await supabase
            .from('lead_custom_values')
            .select('value')
            .eq('lead_id', leadId)
            .eq('custom_field_id', req.field_key)
            .single()

          if (!cv || !cv.value || cv.value.trim() === '') {
            const { data: cf } = await supabase
              .from('custom_fields')
              .select('name')
              .eq('id', req.field_key)
              .single()
            missingFields.push(cf?.name || req.field_key)
          }
        } else {
          const value = (lead as any)[req.field_key]
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            const fieldNames: Record<string, string> = {
              name: 'Nome',
              email: 'Email',
              phone: 'Telefone',
              company: 'Empresa',
              job_title: 'Cargo',
              source: 'Origem',
              notes: 'Observações',
            }
            missingFields.push(fieldNames[req.field_key] || req.field_key)
          }
        }
      }
    }

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando', missingFields }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Update lead stage
    const { error: updateError } = await supabase
      .from('leads')
      .update({ stage_id: stageId, updated_at: new Date().toISOString() })
      .eq('id', leadId)

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Register activity
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      workspace_id: lead.workspace_id,
      type: 'stage_changed',
      metadata: { from_stage_id: lead.stage_id, to_stage_id: stageId },
    })

    // Trigger auto-generation if stage has trigger campaigns
    try {
      const { data: triggerCampaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', lead.workspace_id)
        .eq('trigger_stage_id', stageId)
        .eq('status', 'active')

      if (triggerCampaigns && triggerCampaigns.length > 0) {
        for (const camp of triggerCampaigns) {
          await fetch(`${supabaseUrl}/functions/v1/trigger-generate-messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader,
            },
            body: JSON.stringify({ leadId, campaignId: camp.id }),
          })
        }
      }
    } catch (triggerErr) {
      console.error('Trigger error:', triggerErr)
    }

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
