'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'

export interface MoveLeadStageInput {
  leadId: string
  stageId: string
}

export interface MoveLeadStageResult {
  success: boolean
  error?: string
  missingFields?: string[]
}

export async function moveLeadStage({ leadId, stageId }: MoveLeadStageInput): Promise<MoveLeadStageResult> {
  try {
    const missingFields = [!leadId ? 'leadId' : null, !stageId ? 'stageId' : null].filter(Boolean) as string[]
    if (missingFields.length) return { success: false, error: 'Campos obrigatórios ausentes.', missingFields }

    const supabase = await createClient()
    const { error: invokeError } = await supabase.functions.invoke('move-lead-stage', { body: { leadId, stageId } })
    if (!invokeError) return { success: true }

    const { data: lead, error: leadError } = await supabase.from('leads').select('id, stage_id, workspace_id').eq('id', leadId).single()
    if (leadError) throw leadError

    const { error: updateError } = await (supabase.from('leads') as any).update({ stage_id: stageId }).eq('id', leadId)
    if (updateError) throw updateError

    const { error: activityError } = await (supabase.from('lead_activities') as any).insert({
      lead_id: leadId,
      workspace_id: lead.workspace_id,
      type: 'stage_changed',
      metadata: { from_stage_id: lead.stage_id, to_stage_id: stageId },
    })
    if (activityError) throw activityError

    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
