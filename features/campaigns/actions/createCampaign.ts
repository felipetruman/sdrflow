'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { CampaignSchema } from '@/lib/validations/campaignSchema'
import type { Campaign } from '@/types/app'
import type { Database } from '@/types/database'

type CreateCampaignResult = { data?: Campaign; error?: string }

async function getCurrentWorkspace(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null
  type WorkspaceMemberWithWorkspace = { workspaces: Database['public']['Tables']['workspaces']['Row'] | null }
  const { data, error } = await supabase.from('workspace_members').select('workspaces (*)').eq('user_id', user.id).maybeSingle() as { data: WorkspaceMemberWithWorkspace | null; error: unknown }
  if (error) throw error
  return (data?.workspaces as Database['public']['Tables']['workspaces']['Row'] | null) ?? null
}

const toNullableString = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function createCampaign(data: CampaignSchema): Promise<CreateCampaignResult> {
  try {
    const supabase = await createClient()
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
