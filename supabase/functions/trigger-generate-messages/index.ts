import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { type AiKey, buildPrompt, callLlmWithFallback, FALLBACK_TEMPLATES } from '../_shared/llm.ts'

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
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { leadId, campaignId } = await req.json()
    if (!leadId || !campaignId) {
      return new Response(JSON.stringify({ error: 'Missing leadId or campaignId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads').select('*').eq('id', leadId).single()
    if (leadError || !lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: member } = await supabase
      .from('workspace_members').select('id')
      .eq('workspace_id', lead.workspace_id).eq('user_id', user.id).single()
    if (!member) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns').select('*')
      .eq('id', campaignId).eq('workspace_id', lead.workspace_id)
      .eq('status', 'active').single()
    if (campaignError || !campaign) {
      return new Response(JSON.stringify({ error: 'Campaign not found or inactive' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: customValues } = await supabase
      .from('lead_custom_values')
      .select('value, custom_fields(name, key, field_type)')
      .eq('lead_id', leadId)

    const customFields = (customValues || [])
      .map((cv: any) => ({ name: cv.custom_fields?.name || '', value: cv.value || '' }))
      .filter((cf) => cf.name)

    const prompt = buildPrompt({
      campaignContext: campaign.context,
      campaignPrompt: campaign.generation_prompt,
      lead, customFields,
    })

    const { data: keysData } = await supabase
      .from('ai_api_keys')
      .select('id, provider, model, key_value, priority, is_primary')
      .eq('workspace_id', lead.workspace_id)
      .eq('is_active', true)

    const keys = (keysData || []) as AiKey[]
    const llmResult = await callLlmWithFallback(keys, prompt, supabase)

    let messages = llmResult.messages
    let source = llmResult.source
    let model = llmResult.model
    let provider = llmResult.provider

    if (messages.length === 0) {
      messages = FALLBACK_TEMPLATES(lead)
      source = 'fallback'
      model = null
      provider = null
    }

    const inserts = messages.map((content) => ({
      lead_id: leadId, campaign_id: campaignId, content,
      status: 'generated' as const, generation_type: 'trigger' as const,
    }))

    const { data: savedMessages, error: insertError } = await supabase
      .from('generated_messages').insert(inserts).select()
    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabase.from('lead_activities').insert({
      lead_id: leadId, workspace_id: lead.workspace_id, type: 'message_generated',
      metadata: { campaign_id: campaignId, generation_type: 'trigger', auto: true, source, model, provider },
    })

    return new Response(
      JSON.stringify({ messages: savedMessages || [], source, model, provider }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
