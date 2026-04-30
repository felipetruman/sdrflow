'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'

export type UpdateCustomFieldInput = {
  id: string
  name?: string
  key?: string
  field_type?: 'text' | 'number' | 'date' | 'boolean' | 'select'
  options?: string[] | null
}

export async function updateCustomField(data: UpdateCustomFieldInput): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { id, ...payload } = data
    const { error } = await (supabase.from('custom_fields') as any).update({ ...(payload.name !== undefined ? { name: payload.name.trim() } : {}), ...(payload.key !== undefined ? { key: payload.key.trim() } : {}), ...(payload.field_type !== undefined ? { field_type: payload.field_type } : {}), ...(payload.options !== undefined ? { options: payload.options } : {}) }).eq('id', id)
    if (error) throw error
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
