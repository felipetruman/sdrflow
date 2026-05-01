'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_STAGES, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { FunnelStage } from '@/types/app'

export async function getFunnelStages(): Promise<FunnelStage[]> {
  if (isDemoMode()) return DEMO_STAGES
  try {
    const supabase = await createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) return []
    const { data: member } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).maybeSingle() as { data: { workspace_id: string } | null; error: unknown }
    if (!member?.workspace_id) return []
    const { data, error } = await supabase.from('funnel_stages').select('*').eq('workspace_id', member.workspace_id).order('order_index', { ascending: true })
    if (error) throw error
    return (data ?? []) as FunnelStage[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
