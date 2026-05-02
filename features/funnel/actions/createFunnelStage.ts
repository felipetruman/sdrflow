'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'

type Input = { name: string; color?: string }

export async function createFunnelStage(input: Input): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

    const { data: existingRaw } = await supabase
      .from('funnel_stages')
      .select('order_index')
      .eq('workspace_id', workspace.id)
      .order('order_index', { ascending: false })

    const existing = (existingRaw ?? []) as { order_index: number }[]
    const maxOrder = existing.reduce((max, s) => Math.max(max, s.order_index), -1)
    const order_index = maxOrder + 1

    const { error } = await supabase.from('funnel_stages').insert({
      workspace_id: workspace.id,
      name: input.name,
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
