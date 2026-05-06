'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { FunnelStage } from '@/types/app'

export async function getFunnelStages(): Promise<FunnelStage[]> {
  if (isDemoMode()) return [...demoStore.getState().stages].sort((a, b) => a.order_index - b.order_index)
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
