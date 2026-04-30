'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'

export async function updateStageRequiredFields({ stageId, fields }: { stageId: string; fields: { field_key: string; is_custom_field: boolean }[] }): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace atual não encontrado.' }

    const { error: deleteError } = await supabase.from('stage_required_fields').delete().eq('stage_id', stageId)
    if (deleteError) throw deleteError

    if (fields.length > 0) {
      const { error: insertError } = await (supabase.from('stage_required_fields') as any).insert(fields.map((field) => ({ workspace_id: workspace.id, stage_id: stageId, ...field })))
      if (insertError) throw insertError
    }

    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
