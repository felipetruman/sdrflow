'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { CampaignSchema } from '@/lib/validations/campaignSchema'
import type { Campaign } from '@/types/app'
import type { Database } from '@/types/database'

type CreateCampaignResult = { data?: Campaign; error?: string }

async function getCurrentWorkspace(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null
  const { data, error } = await (supabase as any).from('workspace_members').select('workspaces (*)').eq('user_id', authData.user.id).maybeSingle()
  if (error) throw error
  return (data?.workspaces as Database['public']['Tables']['workspaces']['Row'] | null) ?? null
}

const toNullableString = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function createCampaign(data: CampaignSchema): Promise<CreateCampaignResult> {
  try {
    const supabase = (await createClient()) as any
    const workspace = await getCurrentWorkspace(supabase)
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
    return { data: campaign as Campaign }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
