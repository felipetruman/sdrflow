'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { StageRequiredField } from '@/types/app'

export async function getStageRequiredFields(stageId: string): Promise<StageRequiredField[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('stage_required_fields').select('*').eq('stage_id', stageId)
    if (error) throw error
    return (data ?? []) as StageRequiredField[]
  } catch (error) {
    console.error(getErrorMessage(error))
    return []
  }
}
