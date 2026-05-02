'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DEMO_WORKSPACE, isDemoMode } from '@/lib/demo/data'
import type { Workspace } from '@/types/app'

function extractWorkspace(raw: unknown): Workspace | null {
  if (!raw) return null
  const row = raw as { workspaces: Workspace | Workspace[] | null }
  if (!row.workspaces) return null
  const ws = Array.isArray(row.workspaces) ? row.workspaces[0] : row.workspaces
  return ws as Workspace
}

export async function getCurrentWorkspace(): Promise<Workspace | null> {
  if (isDemoMode()) return DEMO_WORKSPACE
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null

  const cookieStore = await cookies()
  const preferredId = cookieStore.get('sdrflow-workspace-id')?.value

  type WsMemberRow = { workspaces: Workspace | Workspace[] | null; workspace_id: string }

  if (preferredId) {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('workspaces(*), workspace_id')
      .eq('user_id', user.id)
      .eq('workspace_id', preferredId)
      .maybeSingle() as { data: WsMemberRow | null; error: unknown }
    if (!error && data) return extractWorkspace(data)
  }

  const { data, error } = await supabase
    .from('workspace_members')
    .select('workspaces(*)')
    .eq('user_id', user.id)
    .maybeSingle() as { data: unknown; error: unknown }
  if (error) return null
  return extractWorkspace(data)
}
