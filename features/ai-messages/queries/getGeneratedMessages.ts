'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { GeneratedMessage } from '@/types/app'

export async function getGeneratedMessages(leadId: string): Promise<GeneratedMessage[]> {
  if (isDemoMode()) return demoStore.getState().messages.filter((message) => message.lead_id === leadId)
  try {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase.from('generated_messages').select('*, campaign:campaigns(*)').eq('lead_id', leadId).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as GeneratedMessage[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
