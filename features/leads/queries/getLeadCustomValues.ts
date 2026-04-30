'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadCustomValue } from '@/types/app'

export async function getLeadCustomValues(leadId: string): Promise<LeadCustomValue[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('lead_custom_values').select('*, custom_field:custom_fields(*)').eq('lead_id', leadId)
    if (error) throw error
    return (data ?? []) as LeadCustomValue[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
