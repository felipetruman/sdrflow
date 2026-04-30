'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { GeneratedMessage } from '@/types/app'

type Input = { leadId: string; campaignId: string }

export async function generateMessages({ leadId, campaignId }: Input): Promise<{ messages?: GeneratedMessage[]; error?: string }> {
  try {
    const supabase = (await createClient()) as any
    const result = await supabase.functions.invoke('generate-messages', { body: { leadId, campaignId } })
    if (!result.error && result.data?.messages) return { messages: result.data.messages as GeneratedMessage[] }

    const [{ data: lead }, { data: campaign }] = await Promise.all([
      supabase.from('leads').select('id,name').eq('id', leadId).single(),
      supabase.from('campaigns').select('id').eq('id', campaignId).single(),
    ])
    if (!lead || !campaign) return { error: 'Lead ou campanha não encontrado' }

    const mockMessages = [1, 2, 3].map((index) => ({ lead_id: leadId, campaign_id: campaignId, content: `Mensagem gerada para ${lead.name} #${index}`, status: 'generated', generation_type: 'manual' }))
    const { data, error } = await supabase.from('generated_messages').insert(mockMessages).select('*, campaign:campaigns(*)').order('created_at', { ascending: false })
    if (error) throw error
    return { messages: (data ?? []) as GeneratedMessage[] }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
