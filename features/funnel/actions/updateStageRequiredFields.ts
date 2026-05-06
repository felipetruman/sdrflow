'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { demoStore, isDemoMode } from '@/lib/demo/data'

export async function updateStageRequiredFields({ stageId, fields }: { stageId: string; fields: { field_key: string; is_custom_field: boolean }[] }): Promise<{ error?: string }> {
  try {
    if (isDemoMode()) {
      // demo mode: no auth context, mutations permitted by design (USE_DEMO_MODE flag)
      const result = demoStore.setStageRequiredFields(stageId, fields)
      if ('error' in result) return { error: result.error }
      return {}
    }
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace atual não encontrado.' }

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) return { error: 'Não autenticado' }

    const { data: myMembership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (myMembership?.role !== 'admin') {
      return { error: 'Apenas administradores podem editar campos obrigatórios' }
    }

    const { data: stage } = await supabase.from('funnel_stages').select('id').eq('id', stageId).eq('workspace_id', workspace.id).maybeSingle()
    if (!stage) return { error: 'Etapa não encontrada no workspace atual.' }

    const { error: deleteError } = await supabase.from('stage_required_fields').delete().eq('stage_id', stageId)
    if (deleteError) throw deleteError

    if (fields.length > 0) {
      const { error: insertError } = await supabase.from('stage_required_fields').insert(fields.map((field) => ({ workspace_id: workspace.id, stage_id: stageId, ...field })))
      if (insertError) throw insertError
    }

    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
