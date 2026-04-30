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

    // Fetch lead with workspace validation
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

    // Check workspace membership
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

    // Fetch campaign
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

    // Fetch custom field values
    const { data: customValues } = await supabase
      .from('lead_custom_values')
      .select('value, custom_fields(name, key, field_type)')
      .eq('lead_id', leadId)

    // Build prompt
    const customFieldsText = (customValues || [])
      .map((cv: any) => `${cv.custom_fields?.name}: ${cv.value}`)
      .join('\n')

    const prompt = `Contexto da campanha: ${campaign.context}

Instruções: ${campaign.generation_prompt}

Dados do lead:
Nome: ${lead.name}
Empresa: ${lead.company || 'N/A'}
Cargo: ${lead.job_title || 'N/A'}
Email: ${lead.email || 'N/A'}
Telefone: ${lead.phone || 'N/A'}
Origem: ${lead.source || 'N/A'}
${customFieldsText ? `Campos personalizados:\n${customFieldsText}` : ''}

Gere 3 mensagens de abordagem personalizadas para este lead. Retorne EXATAMENTE um JSON no formato:
{"messages": ["mensagem 1", "mensagem 2", "mensagem 3"]}
Sem markdown, sem explicações extras.`

    // Try to call LLM API if key is configured
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

        // Extract JSON from content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (Array.isArray(parsed.messages) && parsed.messages.length >= 2) {
            messages = parsed.messages.slice(0, 3)
          }
        }
      } catch (llmErr) {
        console.error('LLM error:', llmErr)
      }
    }

    // Fallback/mock if LLM failed or not configured
    if (messages.length === 0) {
      messages = [
        `Olá ${lead.name}, tudo bem? Vi que você é ${lead.job_title || 'profissional'} na ${lead.company || 'sua empresa'} e gostaria de conversar sobre como podemos ajudar.`,
        `Oi ${lead.name}! Meu nome é [Seu Nome] e trabalho com soluções para empresas como a ${lead.company || 'sua'}. Podemos marcar uma conversa rápida?`,
        `${lead.name}, encontrei seu perfil e achei relevante nosso trabalho para ${lead.company || 'sua área'}. Topa trocar uma ideia?`,
      ]
    }

    // Save messages
    const inserts = messages.map((content) => ({
      lead_id: leadId,
      campaign_id: campaignId,
      content,
      status: 'generated' as const,
      generation_type: 'manual' as const,
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

    // Register activity
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      workspace_id: lead.workspace_id,
      type: 'message_generated',
      metadata: { campaign_id: campaignId, campaign_name: campaign.name, count: messages.length },
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
