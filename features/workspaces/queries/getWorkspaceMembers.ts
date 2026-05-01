'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_WORKSPACE, isDemoMode } from '@/lib/demo/data'
import { getCurrentWorkspace } from './getCurrentWorkspace'

type WorkspaceMember = {
  id: string
  user_id: string
  workspace_id: string
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  if (isDemoMode()) {
    return [
      { id: 'demo-member-1', user_id: 'demo-user', workspace_id: DEMO_WORKSPACE.id },
      { id: 'demo-member-2', user_id: 'demo-user-2', workspace_id: DEMO_WORKSPACE.id },
    ]
  }

  const workspace = await getCurrentWorkspace()
  if (!workspace) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workspace_members')
    .select('id, user_id, workspace_id')
    .eq('workspace_id', workspace.id)

  if (error || !data) return []

  return data as WorkspaceMember[]
}
