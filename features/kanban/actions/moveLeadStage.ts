'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
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
  if (isDemoMode()) {
    const result = demoStore.moveLeadStage(leadId, stageId)
    if (result && typeof result === 'object' && 'success' in result) return result as MoveLeadStageResult
    return { success: false, error: 'Lead não encontrado.' }
  }
  try {
    const missingFields = [!leadId ? 'leadId' : null, !stageId ? 'stageId' : null].filter(Boolean) as string[]
    if (missingFields.length) return { success: false, error: 'Campos obrigatórios ausentes.', missingFields }

    const supabase = await createClient()
    const { error: invokeError } = await supabase.functions.invoke('move-lead-stage', { body: { leadId, stageId } })
    if (!invokeError) return { success: true }

    // Do not bypass required-field validation when Edge Function is unavailable
    console.error('move-lead-stage Edge Function failed:', invokeError)
    return { success: false, error: 'Validação de campos obrigatórios indisponível no momento. Tente novamente em instantes.' }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
