'use server'

import { createClient } from '@/lib/supabase/server'
import type { Workspace } from '@/types/app'

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return []
  const { data, error } = await supabase.from('workspace_members').select('workspaces(*)').eq('user_id', user.id)
  if (error || !data) {
    if (error) console.error('[getUserWorkspaces] DB error:', error)
    return []
  }
  type WorkspaceMemberRow = { workspaces: Workspace | Workspace[] | null }
  return (data as unknown as WorkspaceMemberRow[]).map((row) => Array.isArray(row.workspaces) ? row.workspaces[0] : row.workspaces).filter(Boolean) as Workspace[]
}
