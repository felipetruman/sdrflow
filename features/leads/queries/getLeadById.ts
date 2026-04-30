'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { Lead } from '@/types/app'

export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data as Lead | null) ?? null
  } catch (error) {
    console.error(getErrorMessage(error))
    return null
  }
}
