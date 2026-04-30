'use client'

import type { DashboardMetrics } from '@/types/app'

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    ['Total Leads', metrics.totalLeads],
    ['Campanhas Ativas', metrics.activeCampaigns],
    ['Mensagens Geradas', metrics.totalMessagesGenerated],
    ['Mensagens Enviadas', metrics.totalMessagesSent],
  ]
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{label as string}</p><p className="mt-2 text-3xl font-bold">{value as number}</p></div>)}</div>
}
