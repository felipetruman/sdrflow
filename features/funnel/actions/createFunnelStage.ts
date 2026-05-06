'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'
import { demoStore, isDemoMode } from '@/lib/demo/data'

type Input = { name: string; color?: string }

export async function createFunnelStage(input: Input): Promise<{ error?: string }> {
  try {
    const name = input.name.trim()
    if (!name || name.length > 100) return { error: 'Nome da etapa inválido (1-100 caracteres)' }
    if (isDemoMode()) {
      demoStore.addStage({ name, color: input.color })
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
      return { error: 'Apenas administradores podem criar etapas' }
    }

    const { data: existingRaw } = await supabase
      .from('funnel_stages')
      .select('order_index')
      .eq('workspace_id', workspace.id)
      .order('order_index', { ascending: false })

    const existing = existingRaw ?? []
    const maxOrder = existing.reduce((max, s) => Math.max(max, s.order_index), -1)
    const order_index = maxOrder + 1

    const { error } = await supabase.from('funnel_stages').insert({
      workspace_id: workspace.id,
      name,
      color: input.color ?? '#64748b',
      order_index,
    })

    if (error) throw error

    revalidatePath('/kanban')
    revalidatePath('/settings/funnel')
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
