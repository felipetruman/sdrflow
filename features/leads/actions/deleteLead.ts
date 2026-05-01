'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'

export async function deleteLead({ id }: { id: string }): Promise<{ error?: string }> {
  if (isDemoMode()) {
    const { demoStore } = await import('@/lib/demo/data')
    const state = demoStore.getState()
    const index = state.leads.findIndex((lead) => lead.id === id)
    if (index === -1) return { error: 'Lead não encontrado' }
    state.leads.splice(index, 1)
    revalidatePath('/kanban')
    revalidatePath('/leads')
    return {}
  }

  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const { error } = await supabase.from('leads').delete().eq('id', id).eq('workspace_id', workspace.id)
    if (error) throw error

    revalidatePath('/kanban')
    revalidatePath('/leads')
    return {}
  } catch (error) {
    console.error(getErrorMessage(error))
    return { error: 'Erro ao excluir lead' }
  }
}
