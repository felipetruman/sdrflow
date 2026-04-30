'use server'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/errors'
import type { DashboardMetrics } from '@/types/app'

async function getCurrentWorkspaceId() {
  const supabase = (await createClient()) as any
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null
  const { data, error } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', authData.user.id).maybeSingle()
  if (error) throw error
  return data?.workspace_id ?? null
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const empty: DashboardMetrics = { totalLeads: 0, leadsByStage: [], activeCampaigns: 0, totalMessagesGenerated: 0, totalMessagesSent: 0 }
  try {
    const supabase = (await createClient()) as any
    const workspaceId = await getCurrentWorkspaceId()
    if (!workspaceId) return empty

    const [leads, stageRows, activeCampaigns, generated, sent] = await Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('leads').select('stage_id, stage:funnel_stages(name)').eq('workspace_id', workspaceId),
      supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'active'),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }),
      supabase.from('generated_messages').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
    ])

    const leadsByStageMap = new Map<string, { stage_id: string; stage_name: string; count: number }>()
    ;(stageRows.data ?? []).forEach((lead: any) => { const stageId = lead.stage_id ?? 'unknown'; const stageName = lead.stage?.name ?? 'Sem estágio'; const current = leadsByStageMap.get(stageId) ?? { stage_id: stageId, stage_name: stageName, count: 0 }; current.count += 1; leadsByStageMap.set(stageId, current) })

    return { totalLeads: leads.count ?? 0, leadsByStage: Array.from(leadsByStageMap.values()), activeCampaigns: activeCampaigns.count ?? 0, totalMessagesGenerated: generated.count ?? 0, totalMessagesSent: sent.count ?? 0 }
  } catch (error) {
    console.error(getErrorMessage(error))
    return empty
  }
}
