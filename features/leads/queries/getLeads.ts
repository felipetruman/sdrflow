'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadWithStage } from '@/types/app'

async function getCurrentWorkspaceId() {
  const supabase = (await createClient()) as any
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null
  const { data, error } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', authData.user.id).maybeSingle()
  if (error) throw error
  return data?.workspace_id ?? null
}

export async function getLeads(): Promise<LeadWithStage[]> {
  try {
    const supabase = (await createClient()) as any
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
