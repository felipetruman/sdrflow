'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import type { StageRequiredField } from '@/types/app'

export async function getStageRequiredFields(stageId: string): Promise<StageRequiredField[]> {
  if (isDemoMode()) {
    return demoStore
      .getState()
      .stageRequiredFields.filter((f) => f.stage_id === stageId)
      .map(({ id, workspace_id, stage_id, field_key, is_custom_field }) => ({ id, workspace_id, stage_id, field_key, is_custom_field }))
  }
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
