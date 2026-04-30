'use server'

import { createClient } from '@/lib/supabase/server'
import type { Workspace } from '@/types/app'

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return []
  const { data, error } = await supabase.from('workspace_members').select('workspaces(*)').eq('user_id', userData.user.id)
  if (error || !data) return []
  return data.map((row: any) => Array.isArray(row.workspaces) ? row.workspaces[0] : row.workspaces).filter(Boolean) as Workspace[]
}
