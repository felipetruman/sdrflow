'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'
import { isDemoMode } from '@/lib/demo/data'

export async function removeWorkspaceMember(memberId: string): Promise<{ error?: string }> {
  try {
    if (isDemoMode()) {
      void memberId
      return { error: 'Remoção de membros disponível apenas no modo cloud (Supabase).' }
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
      .maybeSingle() as { data: { role: string } | null; error: unknown }

    if (myMembership?.role !== 'admin') {
      return { error: 'Apenas administradores podem remover membros' }
    }

    const { data: target } = await supabase
      .from('workspace_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('workspace_id', workspace.id)
      .maybeSingle() as { data: { user_id: string; role: string } | null; error: unknown }

    if (!target) return { error: 'Membro não encontrado' }
    if (target.user_id === user.id) return { error: 'Não é possível remover a si mesmo' }

    if (target.role === 'admin') {
      const { data: admins } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', workspace.id)
        .eq('role', 'admin') as { data: { id: string }[] | null; error: unknown }

      if (((admins ?? []) as { id: string }[]).length <= 1) {
        return { error: 'Não é possível remover o último administrador' }
      }
    }

    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId)
      .eq('workspace_id', workspace.id)

    if (error) throw error

    revalidatePath('/settings/members')
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
