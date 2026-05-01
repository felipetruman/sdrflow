'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/features/workspaces/queries/getCurrentWorkspace'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { LeadSchema } from '@/lib/validations/leadSchema'
import type { Lead } from '@/types/app'

type CreateLeadResult = { data?: Lead; error?: string }

const toNullableString = (value: string | undefined | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

async function triggerAutoGeneration(supabase: Awaited<ReturnType<typeof createClient>>, leadId: string, stageId: string, workspaceId: string, authHeader?: string) {
  try {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('trigger_stage_id', stageId)
      .eq('status', 'active')

    const campaignList = campaigns as { id: string }[] | null
    if (campaignList && campaignList.length > 0) {
      for (const camp of campaignList) {
        if (authHeader) {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 5000)
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trigger-generate-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify({ leadId, campaignId: camp.id }),
            signal: controller.signal,
          }).finally(() => clearTimeout(timeout))
        }
      }
    }
  } catch (err) {
    console.error('[triggerAutoGeneration]', err)
  }
}

export async function createLead(data: LeadSchema): Promise<CreateLeadResult> {
  if (isDemoMode()) {
    const lead = demoStore.addLead({ id: `lead-${Date.now()}`, workspace_id: demoStore.getState().workspace.id, stage_id: data.stage_id, name: data.name.trim(), email: toNullableString(data.email), phone: toNullableString(data.phone), company: toNullableString(data.company), job_title: toNullableString(data.job_title), source: toNullableString(data.source), notes: toNullableString(data.notes), owner_id: toNullableString(data.owner_id), status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    // Trigger auto-generation in demo mode
    const triggerCampaigns = demoStore.getState().campaigns.filter((c) => c.trigger_stage_id === data.stage_id && c.status === 'active')
    for (const camp of triggerCampaigns) {
      demoStore.getState().messages.push({
        id: `msg-trigger-${Date.now()}-${camp.id}`,
        lead_id: lead.id,
        campaign_id: camp.id,
        content: `Mensagem automática para ${lead.name} via campanha "${camp.name}".`,
        status: 'generated',
        generation_type: 'trigger',
        sent_at: null,
        created_at: new Date().toISOString(),
        campaign: camp,
      })
      demoStore.getState().activities.push({
        id: `act-trigger-${Date.now()}`,
        lead_id: lead.id,
        workspace_id: lead.workspace_id,
        type: 'message_generated',
        metadata: { campaign_id: camp.id, generation_type: 'trigger', auto: true },
        created_at: new Date().toISOString(),
      })
    }
    return { data: lead }
  }
  try {
    const supabase = await createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    const workspace = await getCurrentWorkspace()
    if (!workspace) return { error: 'Workspace atual não encontrado' }
    const payload = {
      workspace_id: workspace.id,
      stage_id: data.stage_id,
      name: data.name.trim(),
      email: toNullableString(data.email),
      phone: toNullableString(data.phone),
      company: toNullableString(data.company),
      job_title: toNullableString(data.job_title),
      source: toNullableString(data.source),
      notes: toNullableString(data.notes),
      owner_id: toNullableString(data.owner_id),
      created_by: user?.id ?? null,
    }
    const { data: lead, error } = await supabase.from('leads').insert(payload).select().single()
    if (error) throw error
    if (!lead) return { error: 'Lead não encontrado após criação' }
    const leadData = lead as { id: string; name: string }
    await supabase.from('lead_activities').insert({
      lead_id: leadData.id,
      workspace_id: workspace.id,
      user_id: user?.id ?? null,
      type: 'lead_created',
      metadata: { lead_name: leadData.name },
    })
    // Trigger auto-generation for campaigns with this stage as trigger
    const authHeader = sessionData?.session ? `Bearer ${sessionData.session.access_token}` : undefined
    await triggerAutoGeneration(supabase, leadData.id, data.stage_id, workspace.id, authHeader)
    revalidatePath('/kanban')
    return { data: lead as Lead }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
