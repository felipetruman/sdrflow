'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { GeneratedMessage } from '@/types/app'

type Input = { leadId: string; campaignId: string }

export async function generateMessages({ leadId, campaignId }: Input): Promise<{ messages?: GeneratedMessage[]; error?: string }> {
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
    return { messages: newMessages }
  }
  try {
    const supabase = await createClient()
    const result = await supabase.functions.invoke<{ messages?: GeneratedMessage[] }>('generate-messages', { body: { leadId, campaignId } })
    if (!result.error && result.data?.messages) return { messages: result.data.messages as GeneratedMessage[] }

    const [{ data: lead }, { data: campaign }] = await Promise.all([
      supabase.from('leads').select('id,name').eq('id', leadId).single(),
      supabase.from('campaigns').select('id').eq('id', campaignId).single(),
    ])
    if (!lead || !campaign) return { error: 'Lead ou campanha não encontrado' }

    const leadData = lead as { name: string }
    const mockMessages = [1, 2, 3].map((index) => ({ lead_id: leadId, campaign_id: campaignId, content: `Mensagem gerada para ${leadData.name} #${index}`, status: 'generated', generation_type: 'manual' }))
    const { data, error } = await supabase.from('generated_messages').insert(mockMessages).select('*, campaign:campaigns(*)').order('created_at', { ascending: false })
    if (error) throw error
    return { messages: (data ?? []) as GeneratedMessage[] }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
