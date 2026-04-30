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

    const { leadId, campaignId } = await req.json()
    if (!leadId || !campaignId) {
      return new Response(JSON.stringify({ error: 'Missing leadId or campaignId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate lead and workspace
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

    // Validate campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('workspace_id', lead.workspace_id)
      .eq('status', 'active')
      .single()

    if (campaignError || !campaign) {
      return new Response(JSON.stringify({ error: 'Campaign not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch custom values
    const { data: customValues } = await supabase
      .from('lead_custom_values')
      .select('value, custom_fields(name, key, field_type)')
      .eq('lead_id', leadId)

    const customFieldsText = (customValues || [])
      .map((cv: any) => `${cv.custom_fields?.name}: ${cv.value}`)
      .join('\n')

    const prompt = `Contexto: ${campaign.context}
Instruções: ${campaign.generation_prompt}
Lead: ${lead.name}, ${lead.company || ''}, ${lead.job_title || ''}
${customFieldsText}`

    // Try LLM
    const llmApiKey = Deno.env.get('LLM_API_KEY')
    const llmModel = Deno.env.get('LLM_MODEL') || 'gpt-4o-mini'
    const llmBaseUrl = Deno.env.get('LLM_BASE_URL') || 'https://api.openai.com/v1'

    let messages: string[] = []

    if (llmApiKey) {
      try {
        const llmRes = await fetch(`${llmBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmApiKey}`,
          },
          body: JSON.stringify({
            model: llmModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
          }),
        })

        const llmData = await llmRes.json()
        const content = llmData.choices?.[0]?.message?.content || ''
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (Array.isArray(parsed.messages) && parsed.messages.length >= 2) {
            messages = parsed.messages.slice(0, 3)
          }
        }
      } catch (llmErr) {
        console.error('LLM trigger error:', llmErr)
      }
    }

    // Fallback
    if (messages.length === 0) {
      messages = [
        `Oi ${lead.name}, vi que você atua como ${lead.job_title || 'profissional'} na ${lead.company || 'sua empresa'} e gostaria de apresentar nossa solução.`,
        `${lead.name}, trabalhamos com empresas do segmento da ${lead.company || 'sua área'} e temos resultados interessantes. Podemos conversar?`,
        `Olá ${lead.name}! Encontrei seu contato e achei relevante para o que fazemos. Tem 5 minutos para uma conversa rápida?`,
      ]
    }

    const inserts = messages.map((content) => ({
      lead_id: leadId,
      campaign_id: campaignId,
      content,
      status: 'generated' as const,
      generation_type: 'trigger' as const,
    }))

    const { data: savedMessages, error: insertError } = await supabase
      .from('generated_messages')
      .insert(inserts)
      .select()

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      workspace_id: lead.workspace_id,
      type: 'message_generated',
      metadata: { campaign_id: campaignId, generation_type: 'trigger', auto: true },
    })

    return new Response(
      JSON.stringify({ messages: savedMessages || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
