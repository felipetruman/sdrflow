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
  const empty: DashboardMetrics = { totalLeads: 0, leadsByStage: [], activeCampaigns: 0, totalMessagesGenerated: 0, totalMessagesSent: 0, leadsLast7Days: 0, leadsLast30Days: 0, messagesByCampaign: [], stageConversionRates: [] }
  if (isDemoMode()) {
    const demo = demoStore.getState()
    const now = Date.now()
    const ago7 = now - 7 * 24 * 60 * 60 * 1000
    const ago30 = now - 30 * 24 * 60 * 60 * 1000
    const leadsByStage = demo.stages.map((stage) => ({ stage_id: stage.id, stage_name: stage.name, count: demo.leads.filter((lead) => lead.stage_id === stage.id).length })).filter((item) => item.count > 0)
    const msgMap = new Map<string, { campaign_id: string; campaign_name: string; count: number }>()
    demo.messages.forEach((msg) => {
      const cid = msg.campaign_id ?? 'unknown'
      const campaign = demo.campaigns.find((c) => c.id === cid)
      const cname = campaign?.name ?? 'Campanha removida'
      const current = msgMap.get(cid) ?? { campaign_id: cid, campaign_name: cname, count: 0 }
      current.count += 1
      msgMap.set(cid, current)
    })
    const orderedStages = [...demo.stages].sort((a, b) => a.order_index - b.order_index)
    const stageConversionRates: { from_stage: string; to_stage: string; rate: number }[] = []
    for (let i = 0; i < orderedStages.length - 1; i++) {
      const fromCount = demo.leads.filter((l) => l.stage_id === orderedStages[i].id).length
      const toCount = demo.leads.filter((l) => l.stage_id === orderedStages[i + 1].id).length
      stageConversionRates.push({
        from_stage: orderedStages[i].name,
        to_stage: orderedStages[i + 1].name,
        rate: fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0,
      })
    }
    return {
      totalLeads: demo.leads.length,
      leadsByStage,
      activeCampaigns: demo.campaigns.filter((campaign) => campaign.status === 'active').length,
      totalMessagesGenerated: demo.messages.length,
      totalMessagesSent: demo.messages.filter((message) => message.status === 'sent').length,
      leadsLast7Days: demo.leads.filter((l) => new Date(l.created_at).getTime() >= ago7).length,
      leadsLast30Days: demo.leads.filter((l) => new Date(l.created_at).getTime() >= ago30).length,
      messagesByCampaign: Array.from(msgMap.values()).sort((a, b) => b.count - a.count).slice(0, 5),
      stageConversionRates,
    }
  }
  try {
    const supabase = await createClient()
    const workspaceId = await getCurrentWorkspaceId()
    if (!workspaceId) return empty

    const nowTs = Date.now()
    const ago7Ts = nowTs - 7 * 24 * 60 * 60 * 1000
    const ago30Ts = nowTs - 30 * 24 * 60 * 60 * 1000

    const [leadsCount, stageRows, activeCampaignsCount, generatedCount, sentCount, msgByCampaign, funnelStagesRaw] = (await Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('leads').select('stage_id, stage:funnel_stages(name), created_at').eq('workspace_id', workspaceId),
      supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'active'),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'sent'),
      supabase.from('generated_messages').select('campaign_id, campaign:campaigns(name)').eq('workspace_id', workspaceId),
      supabase.from('funnel_stages').select('id, name, order_index').eq('workspace_id', workspaceId).order('order_index', { ascending: true }),
    ])) as unknown as [
      { data: null; error: unknown; count: number | null },
      { data: unknown[] | null },
      { data: null; error: unknown; count: number | null },
      { data: null; error: unknown; count: number | null },
      { data: null; error: unknown; count: number | null },
      { data: unknown[] | null },
      { data: unknown[] | null },
    ]

    const leadsByStageMap = new Map<string, { stage_id: string; stage_name: string; count: number }>()
    type StageRow = { stage_id: string | null; stage?: { name: string | null } | null; created_at: string }
    const allLeadRows = (stageRows.data ?? []) as StageRow[]
    allLeadRows.forEach((lead) => { const stageId = lead.stage_id ?? 'unknown'; const stageName = lead.stage?.name ?? 'Sem estágio'; const current = leadsByStageMap.get(stageId) ?? { stage_id: stageId, stage_name: stageName, count: 0 }; current.count += 1; leadsByStageMap.set(stageId, current) })
    const leadsLast7Days = allLeadRows.filter((l) => new Date(l.created_at).getTime() >= ago7Ts).length
    const leadsLast30Days = allLeadRows.filter((l) => new Date(l.created_at).getTime() >= ago30Ts).length

    type MsgRow = { campaign_id: string | null; campaign?: { name: string | null } | null }
    const msgMap = new Map<string, { campaign_id: string; campaign_name: string; count: number }>()
    ;((msgByCampaign.data ?? []) as MsgRow[]).forEach((msg) => {
      const cid = msg.campaign_id ?? 'unknown'
      const cname = msg.campaign?.name ?? 'Campanha removida'
      const current = msgMap.get(cid) ?? { campaign_id: cid, campaign_name: cname, count: 0 }
      current.count += 1
      msgMap.set(cid, current)
    })
    const messagesByCampaign = Array.from(msgMap.values()).sort((a, b) => b.count - a.count).slice(0, 5)

    type FunnelStageRow = { id: string; name: string; order_index: number }
    const orderedStages = ((funnelStagesRaw.data ?? []) as FunnelStageRow[]).sort((a, b) => a.order_index - b.order_index)
    const stageConversionRates: { from_stage: string; to_stage: string; rate: number }[] = []
    for (let i = 0; i < orderedStages.length - 1; i++) {
      const fromCount = leadsByStageMap.get(orderedStages[i].id)?.count ?? 0
      const toCount = leadsByStageMap.get(orderedStages[i + 1].id)?.count ?? 0
      stageConversionRates.push({
        from_stage: orderedStages[i].name,
        to_stage: orderedStages[i + 1].name,
        rate: fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0,
      })
    }

    return {
      totalLeads: leadsCount.count ?? 0,
      leadsByStage: Array.from(leadsByStageMap.values()),
      activeCampaigns: activeCampaignsCount.count ?? 0,
      totalMessagesGenerated: generatedCount.count ?? 0,
      totalMessagesSent: sentCount.count ?? 0,
      leadsLast7Days,
      leadsLast30Days,
      messagesByCampaign,
      stageConversionRates,
    }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
