'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { GeneratedMessage } from '@/types/app'

type Input = { leadId: string; campaignId: string }

export type GenerateMessagesResult = {
  messages?: GeneratedMessage[]
  source?: 'llm' | 'fallback' | 'demo'
  model?: string | null
  error?: string
}

export async function generateMessages({ leadId, campaignId }: Input): Promise<GenerateMessagesResult> {
  if (isDemoMode()) {
    const lead = demoStore.getState().leads.find((l) => l.id === leadId)
    const campaign = demoStore.getState().campaigns.find((c) => c.id === campaignId)
    if (!lead || !campaign) return { error: 'Lead ou campanha não encontrado' }
    const newMessages: GeneratedMessage[] = [1, 2, 3].map((index) => ({
      id: `msg-${Date.now()}-${index}`,
      lead_id: leadId,
      campaign_id: campaignId,
      content: `Olá ${lead.name}, tudo bem? Aqui é da SDRFlow. Gostaria de conversar sobre como podemos ajudar a ${lead.company || 'sua empresa'} a escalar o pipeline comercial. #${index}`,
      status: 'generated' as const,
      generation_type: 'manual' as const,
      sent_at: null,
      created_at: new Date().toISOString(),
      campaign,
    }))
    demoStore.getState().messages.push(...newMessages)
    return { messages: newMessages, source: 'demo', model: null }
  }
  try {
    const supabase = await createClient()
    const result = await supabase.functions.invoke<{ messages?: GeneratedMessage[]; source?: 'llm' | 'fallback'; model?: string | null }>(
      'generate-messages',
      { body: { leadId, campaignId } },
    )
    if (!result.error && result.data?.messages) {
      return {
        messages: result.data.messages as GeneratedMessage[],
        source: result.data.source ?? 'fallback',
        model: result.data.model ?? null,
      }
    }

    // Do not insert fake messages when Edge Function is unavailable
    console.error('generate-messages Edge Function failed:', result.error)
    return { error: 'Geração de mensagens indisponível no momento. Tente novamente em instantes.' }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
