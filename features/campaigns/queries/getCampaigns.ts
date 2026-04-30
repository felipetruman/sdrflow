'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { Campaign } from '@/types/app'

async function getCurrentWorkspaceId() {
  const supabase = (await createClient()) as any
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null
  const { data, error } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', authData.user.id).maybeSingle()
  if (error) throw error
  return data?.workspace_id ?? null
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = (await createClient()) as any
    const workspaceId = await getCurrentWorkspaceId()
    if (!workspaceId) return []
    const { data, error } = await supabase.from('campaigns').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Campaign[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
