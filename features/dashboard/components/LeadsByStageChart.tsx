'use client'

import type { DashboardMetrics } from '@/types/app'

export function LeadsByStageChart({ metrics }: { metrics: DashboardMetrics }) {
  const max = Math.max(1, ...metrics.leadsByStage.map((item) => item.count))
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="mb-4 text-lg font-semibold">Leads por estágio</h2><div className="space-y-3">{metrics.leadsByStage.map((item) => <div key={item.stage_id}><div className="mb-1 flex justify-between text-sm"><span>{item.stage_name}</span><span>{item.count}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-sky-500" style={{ width: `${(item.count / max) * 100}%` }} /></div></div>)}{metrics.leadsByStage.length === 0 ? <p className="text-sm text-slate-500">Sem dados ainda.</p> : null}</div></div>
}
