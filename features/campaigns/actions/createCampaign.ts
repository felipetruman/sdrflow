'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { getErrorMessage } from '@/lib/utils/errors'
import type { CampaignSchema } from '@/lib/validations/campaignSchema'
import type { Campaign } from '@/types/app'

type CreateCampaignResult = { data?: Campaign; error?: string }

const toNullableString = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function createCampaign(data: CampaignSchema): Promise<CreateCampaignResult> {
  try {
    const supabase = await createClient()
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace atual não encontrado' }

    const { data: campaign, error } = await supabase.from('campaigns').insert({
      workspace_id: workspace.id,
      name: data.name.trim(),
      context: data.context.trim(),
      generation_prompt: data.generation_prompt.trim(),
      trigger_stage_id: toNullableString(data.trigger_stage_id),
      status: data.status,
    }).select().single()
    if (error) throw error
    revalidatePath('/campaigns')
    return { data: campaign as Campaign }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
