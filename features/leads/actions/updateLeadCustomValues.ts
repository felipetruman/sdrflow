'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'

export async function updateLeadCustomValues(leadId: string, values: Record<string, string>) {
  try {
    const supabase = (await createClient()) as any
    const entries = Object.entries(values)
    if (entries.length === 0) return {}
    const { error } = await supabase.from('lead_custom_values').upsert(entries.map(([custom_field_id, value]) => ({ lead_id: leadId, custom_field_id, value: value?.trim() || null })), { onConflict: 'lead_id,custom_field_id' })
    if (error) throw error
    return {}
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
