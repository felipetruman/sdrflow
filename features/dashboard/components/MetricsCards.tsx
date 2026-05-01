'use client'

import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { DashboardMetrics } from '@/types/app'

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  if (metrics.totalLeads === 0) return <EmptyState icon={Inbox} title="Sem leads ainda" description="Assim que os leads entrarem, os indicadores aparecem aqui." />
  const cards = [
    ['Total Leads', metrics.totalLeads],
    ['Campanhas Ativas', metrics.activeCampaigns],
    ['Mensagens Geradas', metrics.totalMessagesGenerated],
    ['Mensagens Enviadas', metrics.totalMessagesSent],
  ]
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{label as string}</p><p className="mt-2 text-3xl font-bold">{value as number}</p></div>)}</div>
}
