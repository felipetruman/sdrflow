'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadActivity } from '@/types/app'

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  if (isDemoMode()) return demoStore.getState().activities.filter((activity) => activity.lead_id === leadId)
  try {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase.from('lead_activities').select('*').eq('lead_id', leadId).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as LeadActivity[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
