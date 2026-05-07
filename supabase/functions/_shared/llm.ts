// Shared LLM call logic for Gemini and OpenAI providers, with fallback chain
// across multiple keys ordered by priority. Updates last_status on each key.

export type AiKey = {
  id: string
  provider: 'gemini' | 'openai'
  model: string
  key_value: string
  priority: number
  is_primary: boolean
}

export type LlmResult = {
  messages: string[]
  source: 'llm' | 'fallback'
  model: string | null
  provider: 'gemini' | 'openai' | null
  keyId: string | null
  attempts: { keyId: string; status: 'ok' | 'invalid' | 'rate_limited' | 'error' }[]
}

const MAX_FALLBACK_ATTEMPTS = 5

export async function callLlmWithFallback(
  keys: AiKey[],
  prompt: string,
  supabase: { from: (table: string) => any },
): Promise<LlmResult> {
  const sorted = [...keys].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.priority - b.priority
  })

  const attempts: LlmResult['attempts'] = []

  for (const key of sorted.slice(0, MAX_FALLBACK_ATTEMPTS)) {
    try {
      const messages = await callProvider(key, prompt)
      if (messages && messages.length >= 2) {
        attempts.push({ keyId: key.id, status: 'ok' })
        await markStatus(supabase, key.id, 'ok')
        return {
          messages: messages.slice(0, 3),
          source: 'llm',
          model: key.model,
          provider: key.provider,
          keyId: key.id,
          attempts,
        }
      }
      attempts.push({ keyId: key.id, status: 'error' })
      await markStatus(supabase, key.id, 'unknown')
    } catch (err) {
      const status = classifyError(err)
      attempts.push({ keyId: key.id, status })
      await markStatus(supabase, key.id, status === 'error' ? 'unknown' : status)
    }
  }

  return { messages: [], source: 'fallback', model: null, provider: null, keyId: null, attempts }
}

async function callProvider(key: AiKey, prompt: string): Promise<string[] | null> {
  if (key.provider === 'gemini') return await callGemini(key, prompt)
  if (key.provider === 'openai') return await callOpenAi(key, prompt)
  return null
}

async function callGemini(key: AiKey, prompt: string): Promise<string[] | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${key.model}:generateContent?key=${key.key_value}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, responseMimeType: 'application/json' },
    }),
  })
  if (res.status === 401 || res.status === 403) throw new Error(`gemini_auth_${res.status}`)
  if (res.status === 429) throw new Error('gemini_rate_limited')
  if (!res.ok) throw new Error(`gemini_http_${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return parseMessages(text)
}

async function callOpenAi(key: AiKey, prompt: string): Promise<string[] | null> {
  const baseUrl = 'https://api.openai.com/v1'
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key.key_value}`,
    },
    body: JSON.stringify({
      model: key.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })
  if (res.status === 401 || res.status === 403) throw new Error(`openai_auth_${res.status}`)
  if (res.status === 429) throw new Error('openai_rate_limited')
  if (!res.ok) throw new Error(`openai_http_${res.status}`)
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  return parseMessages(text)
}

function parseMessages(content: string): string[] | null {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    const parsed = JSON.parse(jsonMatch[0])
    if (Array.isArray(parsed.messages)) return parsed.messages
    return null
  } catch {
    return null
  }
}

function classifyError(err: unknown): 'invalid' | 'rate_limited' | 'error' {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('auth_401') || msg.includes('auth_403') || msg.includes('invalid')) return 'invalid'
  if (msg.includes('rate_limited') || msg.includes('429')) return 'rate_limited'
  return 'error'
}

async function markStatus(
  supabase: { from: (table: string) => any },
  keyId: string,
  status: 'ok' | 'invalid' | 'rate_limited' | 'unknown',
): Promise<void> {
  try {
    await supabase
      .from('ai_api_keys')
      .update({ last_status: status, last_validated_at: new Date().toISOString() })
      .eq('id', keyId)
  } catch {
    // best-effort, don't fail the generation if status update fails
  }
}

export function buildPrompt(args: {
  campaignContext: string
  campaignPrompt: string
  lead: { name: string; company: string | null; job_title: string | null; email: string | null; phone: string | null; source: string | null }
  customFields: { name: string; value: string }[]
}): string {
  const { campaignContext, campaignPrompt, lead, customFields } = args
  const customText = customFields.map((cf) => `${cf.name}: ${cf.value}`).join('\n')
  return `Contexto da campanha: ${campaignContext}

Instruções: ${campaignPrompt}

Dados do lead:
Nome: ${lead.name}
Empresa: ${lead.company || 'N/A'}
Cargo: ${lead.job_title || 'N/A'}
Email: ${lead.email || 'N/A'}
Telefone: ${lead.phone || 'N/A'}
Origem: ${lead.source || 'N/A'}
${customText ? `Campos personalizados:\n${customText}` : ''}

Gere 3 mensagens de abordagem personalizadas para este lead. Retorne EXATAMENTE um JSON no formato:
{"messages": ["mensagem 1", "mensagem 2", "mensagem 3"]}
Sem markdown, sem explicações extras.`
}

export const FALLBACK_TEMPLATES = (lead: { name: string; company: string | null; job_title: string | null }): string[] => [
  `Olá ${lead.name}, tudo bem? Vi que você é ${lead.job_title || 'profissional'} na ${lead.company || 'sua empresa'} e gostaria de conversar sobre como podemos ajudar.`,
  `Oi ${lead.name}! Meu nome é [Seu Nome] e trabalho com soluções para empresas como a ${lead.company || 'sua'}. Podemos marcar uma conversa rápida?`,
  `${lead.name}, encontrei seu perfil e achei relevante nosso trabalho para ${lead.company || 'sua área'}. Topa trocar uma ideia?`,
]
