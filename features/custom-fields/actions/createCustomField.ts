'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'

export interface CreateCustomFieldInput {
  name: string
  key: string
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select'
  options?: string[] | null
}

export async function createCustomField(data: CreateCustomFieldInput): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace atual não encontrado.' }
    const { error } = await supabase.from('custom_fields').insert({
      workspace_id: workspace.id,
      name: data.name.trim(),
      key: data.key.trim(),
      field_type: data.field_type,
      options: data.options ?? null,
    })
    if (error) throw error
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
