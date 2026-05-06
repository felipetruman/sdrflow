'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'
import { demoStore, isDemoMode } from '@/lib/demo/data'

type Input = { name: string; color?: string }

export async function updateFunnelStage(id: string, input: Input): Promise<{ error?: string }> {
  try {
    if (isDemoMode()) {
      // demo mode: no auth context, mutations permitted by design (USE_DEMO_MODE flag)
      const result = demoStore.updateStage(id, input)
      if (!result) return { error: 'Etapa não encontrada' }
      revalidatePath('/kanban')
      revalidatePath('/settings/funnel')
      return {}
    }
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

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
      return { error: 'Apenas administradores podem editar etapas' }
    }

    const { error } = await supabase
      .from('funnel_stages')
      .update({ name: input.name, color: input.color ?? null })
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
