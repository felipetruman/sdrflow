'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadSchema } from '@/lib/validations/leadSchema'
import type { Lead } from '@/types/app'

type UpdateLeadInput = Partial<LeadSchema>
type UpdateLeadResult = { data?: Lead; error?: string }

const toNullableString = (value: string | undefined | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function updateLead(id: string, data: UpdateLeadInput): Promise<UpdateLeadResult> {
  if (isDemoMode()) return { data: demoStore.updateLead(id, { ...(data.name ? { name: data.name.trim() } : {}), ...(data.stage_id ? { stage_id: data.stage_id } : {}), ...(data.email !== undefined ? { email: toNullableString(data.email) } : {}), ...(data.phone !== undefined ? { phone: toNullableString(data.phone) } : {}), ...(data.company !== undefined ? { company: toNullableString(data.company) } : {}), ...(data.job_title !== undefined ? { job_title: toNullableString(data.job_title) } : {}), ...(data.source !== undefined ? { source: toNullableString(data.source) } : {}), ...(data.notes !== undefined ? { notes: toNullableString(data.notes) } : {}), ...(data.owner_id !== undefined ? { owner_id: toNullableString(data.owner_id) } : {}), }) as Lead }
  try {
    const supabase = await createClient()
    const payload = { ...(data.name ? { name: data.name.trim() } : {}), ...(data.stage_id ? { stage_id: data.stage_id } : {}), ...(data.email !== undefined ? { email: toNullableString(data.email) } : {}), ...(data.phone !== undefined ? { phone: toNullableString(data.phone) } : {}), ...(data.company !== undefined ? { company: toNullableString(data.company) } : {}), ...(data.job_title !== undefined ? { job_title: toNullableString(data.job_title) } : {}), ...(data.source !== undefined ? { source: toNullableString(data.source) } : {}), ...(data.notes !== undefined ? { notes: toNullableString(data.notes) } : {}), ...(data.owner_id !== undefined ? { owner_id: toNullableString(data.owner_id) } : {}) }
    const { data: lead, error } = await supabase.from('leads').update(payload).eq('id', id).select().single()
    if (error) throw error
    if (!lead) return { error: 'Lead não encontrado após atualização' }
    const leadData = lead as { id: string; workspace_id: string; name: string }
    await supabase.from('lead_activities').insert({ lead_id: leadData.id, workspace_id: leadData.workspace_id, type: 'lead_updated', metadata: { lead_name: leadData.name } })
    return { data: lead as Lead }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
