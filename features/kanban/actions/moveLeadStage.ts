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
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session?.user) return { success: false, error: 'Não autenticado' }

    const { error: invokeError } = await supabase.functions.invoke('move-lead-stage', { body: { leadId, stageId } })
    if (!invokeError) return { success: true }

    // Try to extract validation details from the Edge Function response body.
    // supabase.functions.invoke wraps non-2xx responses in FunctionsHttpError with .context as the original Response.
    const ctx = (invokeError as { context?: Response }).context
    if (ctx && typeof ctx.json === 'function') {
      try {
        const body = (await ctx.json()) as { error?: string; missingFields?: string[] }
        if (body && Array.isArray(body.missingFields) && body.missingFields.length > 0) {
          return {
            success: false,
            error: body.error ?? 'Campos obrigatórios faltando',
            missingFields: body.missingFields,
          }
        }
        if (body?.error) return { success: false, error: body.error }
      } catch {
        // fall through to generic error below
      }
    }

    console.error('move-lead-stage Edge Function failed:', invokeError)
    return { success: false, error: 'Não foi possível mover o lead. Tente novamente em instantes.' }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
