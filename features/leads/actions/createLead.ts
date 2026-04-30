'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadSchema } from '@/lib/validations/leadSchema'
import type { Lead } from '@/types/app'
import type { Database } from '@/types/database'

type CreateLeadResult = { data?: Lead; error?: string }

async function getCurrentWorkspace(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null
  const { data, error } = await (supabase as any).from('workspace_members').select('workspaces (*)').eq('user_id', authData.user.id).maybeSingle()
  if (error) throw error
  return (data?.workspaces as Database['public']['Tables']['workspaces']['Row'] | null) ?? null
}

const toNullableString = (value: string | undefined | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function createLead(data: LeadSchema): Promise<CreateLeadResult> {
  try {
    const supabase = (await createClient()) as any
    const workspace = await getCurrentWorkspace(supabase)
    if (!workspace) return { error: 'Workspace atual não encontrado' }
    const payload = { workspace_id: workspace.id, stage_id: data.stage_id, name: data.name.trim(), email: toNullableString(data.email), phone: toNullableString(data.phone), company: toNullableString(data.company), job_title: toNullableString(data.job_title), source: toNullableString(data.source), notes: toNullableString(data.notes), owner_id: toNullableString(data.owner_id) }
    const { data: lead, error } = await supabase.from('leads').insert(payload).select().single()
    if (error) throw error
    await supabase.from('lead_activities').insert({ lead_id: lead.id, workspace_id: workspace.id, type: 'lead_created', metadata: { lead_name: lead.name } })
    return { data: lead as Lead }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
