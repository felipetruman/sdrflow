'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import type { FunnelStage } from '@/types/app'

export async function getFunnelStages(): Promise<FunnelStage[]> {
  if (isDemoMode()) return [...demoStore.getState().stages].sort((a, b) => a.order_index - b.order_index)
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return []
    const { data, error } = await supabase.from('funnel_stages').select('*').eq('workspace_id', workspace.id).order('order_index', { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
