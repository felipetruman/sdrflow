'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_WORKSPACE, isDemoMode } from '@/lib/demo/data'
import { getCurrentWorkspace } from './getCurrentWorkspace'

type WorkspaceMember = {
  id: string
  user_id: string
  workspace_id: string
  label: string
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  if (isDemoMode()) {
    return [
      { id: 'demo-member-1', user_id: 'demo-user', workspace_id: DEMO_WORKSPACE.id, label: 'Usuário Demo 1' },
      { id: 'demo-member-2', user_id: 'demo-user-2', workspace_id: DEMO_WORKSPACE.id, label: 'Usuário Demo 2' },
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

  // Try to fetch user emails via auth admin (requires service_role)
  let userMap: Record<string, string> = {}
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
      )
      const userIds = (data as { user_id: string }[]).map((m) => m.user_id)
      const { data: users } = await adminClient.auth.admin.listUsers()
      if (users?.users) {
        userMap = Object.fromEntries(
          users.users.map((u) => [u.id, u.email || u.user_metadata?.name || u.id])
        )
      }
    }
  } catch {
    // fallback to user_id
  }

  return (data as Omit<WorkspaceMember, 'label'>[]).map((m) => ({
    ...m,
    label: userMap[m.user_id] || `Usuário ${m.user_id.slice(0, 8)}`,
  }))
}
