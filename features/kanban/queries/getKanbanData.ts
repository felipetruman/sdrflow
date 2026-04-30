'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import type { KanbanData } from '@/types/app'

export async function getKanbanData(): Promise<KanbanData> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { stages: [], leads: [] }

    const { data: stages, error: stagesError } = await supabase.from('funnel_stages').select('*').eq('workspace_id', workspace.id).order('order_index', { ascending: true })
    if (stagesError) throw stagesError

    const { data: leads, error: leadsError } = await supabase.from('leads').select('*, stage:funnel_stages(*)').eq('workspace_id', workspace.id).order('updated_at', { ascending: false })
    if (leadsError) throw leadsError

    return { stages: (stages ?? []) as KanbanData['stages'], leads: (leads ?? []) as KanbanData['leads'] }
  } catch (error) {
    console.error(getErrorMessage(error))
    return { stages: [], leads: [] }
  }
}
