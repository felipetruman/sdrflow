'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import type { CustomField } from '@/types/app'

export async function getCustomFields(): Promise<CustomField[]> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return []
    const { data, error } = await supabase.from('custom_fields').select('*').eq('workspace_id', workspace.id).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as CustomField[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
