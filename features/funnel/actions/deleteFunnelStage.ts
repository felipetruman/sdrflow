'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'

export async function deleteFunnelStage(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const { data: leadsInStage } = await supabase
      .from('leads')
      .select('id')
      .eq('stage_id', id)
      .eq('workspace_id', workspace.id)

    const leadCount = ((leadsInStage ?? []) as { id: string }[]).length
    if (leadCount > 0) {
      return { error: `Não é possível excluir: ${leadCount} lead(s) nesta etapa. Mova-os primeiro.` }
    }

    const { error } = await supabase
      .from('funnel_stages')
      .delete()
      .eq('id', id)
      .eq('workspace_id', workspace.id)

    if (error) throw error

    revalidatePath('/kanban')
    revalidatePath('/settings/funnel')
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
