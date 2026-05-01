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

  // Fetch labels only for the specific members of this workspace (never all tenants)
  const userMap: Record<string, string> = {}
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
      )
      const memberIds = (data as { user_id: string }[]).map((m) => m.user_id)
      await Promise.all(
        memberIds.map(async (userId) => {
          try {
            const { data: userResult } = await adminClient.auth.admin.getUserById(userId)
            if (userResult?.user) {
              const meta = userResult.user.user_metadata as { name?: string } | undefined
              userMap[userId] = userResult.user.email || meta?.name || userId
            }
          } catch {
            // keep fallback label for this user
          }
        }),
      )
    }
  } catch {
    // fallback to user_id
  }

  return (data as Omit<WorkspaceMember, 'label'>[]).map((m) => ({
    ...m,
    label: userMap[m.user_id] || `Usuário ${m.user_id.slice(0, 8)}`,
  }))
}
