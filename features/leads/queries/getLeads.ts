'use server'

import { createClient } from '@/lib/supabase/server'
import { enrichLeadsWithStage, isDemoMode, demoStore } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadWithStage } from '@/types/app'

async function getCurrentWorkspaceId() {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null
  const { data, error } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).maybeSingle() as { data: { workspace_id: string } | null; error: unknown }
  if (error) throw error
  return data?.workspace_id ?? null
}

export async function getLeads(): Promise<LeadWithStage[]> {
  if (isDemoMode()) return enrichLeadsWithStage(demoStore.getState().leads)
  try {
    const supabase = await createClient()
    const workspaceId = await getCurrentWorkspaceId()
    if (!workspaceId) return []
    const { data, error } = await supabase.from('leads').select('*, stage:funnel_stages(*)').eq('workspace_id', workspaceId).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as LeadWithStage[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
