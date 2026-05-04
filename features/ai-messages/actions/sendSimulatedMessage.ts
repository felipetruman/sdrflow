'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'

export async function sendSimulatedMessage({ messageId }: { messageId: string }): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    const message = demoStore.getState().messages.find((m) => m.id === messageId)
    if (!message) return { success: false, error: 'Mensagem não encontrada' }
    const lead = demoStore.getState().leads.find((l) => l.id === message.lead_id)
    if (!lead) return { success: false, error: 'Lead não encontrado' }
    const stage = demoStore.getState().stages.find((s) => s.name === 'Tentando Contato')
    if (stage) {
      lead.stage_id = stage.id
      lead.updated_at = new Date().toISOString()
    }
    message.status = 'sent'
    message.sent_at = new Date().toISOString()
    demoStore.getState().activities.push({
      id: `act-sent-${Date.now()}`,
      lead_id: message.lead_id,
      workspace_id: lead.workspace_id,
      type: 'message_sent',
      metadata: { message_id: messageId, campaign_id: message.campaign_id },
      created_at: new Date().toISOString(),
    })
    return { success: true }
  }
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return { success: false, error: 'Não autenticado' }

    const { data: memberRow } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', session.user.id).maybeSingle() as { data: { workspace_id: string } | null; error: unknown }
    if (!memberRow) return { success: false, error: 'Workspace não encontrado' }
    const workspaceId = memberRow.workspace_id

    const result = await supabase.functions.invoke('send-message-simulated', { body: { messageId } })
    if (!result.error) return { success: true }

    type GeneratedMessageWithLead = { lead_id: string; lead: { workspace_id: string } | null }
    const { data: message, error: messageError } = await supabase.from('generated_messages').select('*, lead:leads(*)').eq('id', messageId).eq('workspace_id', workspaceId).single() as { data: GeneratedMessageWithLead | null; error: unknown }
    if (messageError) throw messageError
    if (!message?.lead) return { success: false, error: 'Mensagem ou lead não encontrado' }
    const { data: stage } = await supabase.from('funnel_stages').select('id').eq('name', 'Tentando Contato').eq('workspace_id', message.lead.workspace_id).maybeSingle() as { data: { id: string } | null; error: unknown }
    if (stage?.id && message?.lead) await supabase.from('leads').update({ stage_id: stage.id }).eq('id', message.lead_id)
    await supabase.from('generated_messages').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', messageId)
    await supabase.from('lead_activities').insert([{ lead_id: message.lead_id, workspace_id: message.lead.workspace_id, type: 'message_generated', metadata: { message_id: messageId } }, { lead_id: message.lead_id, workspace_id: message.lead.workspace_id, type: 'message_sent', metadata: { message_id: messageId } }])
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
