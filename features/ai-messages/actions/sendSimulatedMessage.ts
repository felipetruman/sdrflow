'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'

export async function sendSimulatedMessage({ messageId }: { messageId: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = (await createClient()) as any
    const result = await supabase.functions.invoke('send-message-simulated', { body: { messageId } })
    if (!result.error) return { success: true }

    const { data: message, error: messageError } = await supabase.from('generated_messages').select('*, lead:leads(*)').eq('id', messageId).single()
    if (messageError) throw messageError
    const { data: stage } = await supabase.from('funnel_stages').select('id').eq('name', 'Tentando Contato').maybeSingle()
    if (stage?.id && message?.lead) await supabase.from('leads').update({ stage_id: stage.id }).eq('id', message.lead_id)
    await supabase.from('generated_messages').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', messageId)
    await supabase.from('lead_activities').insert([{ lead_id: message.lead_id, workspace_id: message.lead.workspace_id, type: 'message_generated', metadata: { message_id: messageId } }, { lead_id: message.lead_id, workspace_id: message.lead.workspace_id, type: 'message_sent', metadata: { message_id: messageId } }])
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
