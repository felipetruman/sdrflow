'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { CampaignSchema } from '@/lib/validations/campaignSchema'
import type { Campaign } from '@/types/app'

type UpdateCampaignInput = Partial<CampaignSchema>
type UpdateCampaignResult = { data?: Campaign; error?: string }

const toNullableString = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function updateCampaign(id: string, data: UpdateCampaignInput): Promise<UpdateCampaignResult> {
  try {
    const supabase = await createClient()
    const payload = {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.context !== undefined ? { context: data.context.trim() } : {}),
      ...(data.generation_prompt !== undefined ? { generation_prompt: data.generation_prompt.trim() } : {}),
      ...(data.trigger_stage_id !== undefined ? { trigger_stage_id: toNullableString(data.trigger_stage_id) } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    }

    const { data: campaign, error } = await supabase.from('campaigns').update(payload).eq('id', id).select().single()
    if (error) throw error
    return { data: campaign as Campaign }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
