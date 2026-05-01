'use server'

import { createClient } from '@/lib/supabase/server'
import { demoStore, isDemoMode } from '@/lib/demo/data'
import { getErrorMessage } from '@/lib/utils/errors'
import type { DashboardMetrics } from '@/types/app'

async function getCurrentWorkspaceId() {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null
  const { data, error } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).maybeSingle() as { data: { workspace_id: string } | null; error: unknown }
  if (error) throw error
  return data?.workspace_id ?? null
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const empty: DashboardMetrics = { totalLeads: 0, leadsByStage: [], activeCampaigns: 0, totalMessagesGenerated: 0, totalMessagesSent: 0 }
  if (isDemoMode()) {
    const demo = demoStore.getState()
    const leadsByStage = demo.stages.map((stage) => ({ stage_id: stage.id, stage_name: stage.name, count: demo.leads.filter((lead) => lead.stage_id === stage.id).length })).filter((item) => item.count > 0)
    return { totalLeads: demo.leads.length, leadsByStage, activeCampaigns: demo.campaigns.filter((campaign) => campaign.status === 'active').length, totalMessagesGenerated: demo.messages.length, totalMessagesSent: demo.messages.filter((message) => message.status === 'sent').length }
  }
  try {
    const supabase = await createClient()
    const workspaceId = await getCurrentWorkspaceId()
    if (!workspaceId) return empty

    const [leads, stageRows, activeCampaigns, generated, sent] = (await Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('leads').select('stage_id, stage:funnel_stages(name)').eq('workspace_id', workspaceId),
      supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'active'),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'sent'),
    ])) as unknown as [
      { count: number | null },
      { data: unknown[] | null },
      { count: number | null },
      { count: number | null },
      { count: number | null },
    ]

    const leadsByStageMap = new Map<string, { stage_id: string; stage_name: string; count: number }>()
    type StageRow = { stage_id: string | null; stage?: { name: string | null } | null }
    ;((stageRows.data ?? []) as StageRow[]).forEach((lead) => { const stageId = lead.stage_id ?? 'unknown'; const stageName = lead.stage?.name ?? 'Sem estágio'; const current = leadsByStageMap.get(stageId) ?? { stage_id: stageId, stage_name: stageName, count: 0 }; current.count += 1; leadsByStageMap.set(stageId, current) })

    return { totalLeads: leads.count ?? 0, leadsByStage: Array.from(leadsByStageMap.values()), activeCampaigns: activeCampaigns.count ?? 0, totalMessagesGenerated: generated.count ?? 0, totalMessagesSent: sent.count ?? 0 }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
