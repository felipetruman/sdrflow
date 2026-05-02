'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { revalidatePath } from 'next/cache'

type Input = { name: string; color?: string }

export async function updateFunnelStage(id: string, input: Input): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace não encontrado' }

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
