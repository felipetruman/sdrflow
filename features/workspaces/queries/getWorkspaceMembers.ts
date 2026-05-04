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

const userLabelCache = new Map<string, string>()

async function resolveUserLabels(userIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  const uncached: string[] = []

  for (const uid of userIds) {
    const cached = userLabelCache.get(uid)
    if (cached) {
      result[uid] = cached
    } else {
      uncached.push(uid)
    }
  }

  if (uncached.length === 0) return result

  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
        const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey)
        await Promise.all(
          uncached.map(async (userId) => {
            try {
              const { data: userResult } = await adminClient.auth.admin.getUserById(userId)
              if (userResult?.user) {
                const meta = userResult.user.user_metadata as { name?: string } | undefined
                const label = userResult.user.email || meta?.name || `Usuário ${userId.slice(0, 8)}`
                result[userId] = label
                userLabelCache.set(userId, label)
              }
            } catch {
              // keep fallback
            }
          }),
        )
      }
    }
  } catch {
    // fallback
  }

  for (const uid of uncached) {
    if (!result[uid]) {
      result[uid] = `Usuário ${uid.slice(0, 8)}`
      userLabelCache.set(uid, result[uid])
    }
  }

  return result
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

  if (error || !data) {
    if (error) console.error('[getWorkspaceMembers] DB error:', error)
    return []
  }

  const memberIds = data.map((m) => m.user_id)
  const userMap = await resolveUserLabels(memberIds)

  return data.map((m) => ({
    ...m,
    label: userMap[m.user_id] || `Usuário ${m.user_id.slice(0, 8)}`,
  }))
}
