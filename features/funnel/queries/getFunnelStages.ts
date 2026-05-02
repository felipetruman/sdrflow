'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import { DEMO_STAGES, isDemoMode } from '@/lib/demo/data'
import type { FunnelStage } from '@/types/app'

export async function getFunnelStages(): Promise<FunnelStage[]> {
  if (isDemoMode()) return DEMO_STAGES
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return []
    const { data, error } = await supabase.from('funnel_stages').select('*').eq('workspace_id', workspace.id).order('order_index', { ascending: true })
    if (error) throw error
    return (data ?? []) as FunnelStage[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
