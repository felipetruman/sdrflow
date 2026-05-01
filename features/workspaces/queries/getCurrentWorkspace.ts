'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_WORKSPACE, isDemoMode } from '@/lib/demo/data'
import type { Workspace } from '@/types/app'

export async function getCurrentWorkspace(): Promise<Workspace | null> {
  if (isDemoMode()) return DEMO_WORKSPACE
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null
  type WorkspaceMemberWithWorkspace = { workspaces: Workspace | Workspace[] | null }
  const { data, error } = await supabase.from('workspace_members').select('workspaces(*)').eq('user_id', user.id).maybeSingle() as { data: WorkspaceMemberWithWorkspace | null; error: unknown }
  if (error || !data?.workspaces) return null
  const ws = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces
  return ws as Workspace
}
