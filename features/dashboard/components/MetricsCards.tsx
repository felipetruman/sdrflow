'use client'

import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { DashboardMetrics } from '@/types/app'

const cards = (m: DashboardMetrics) => [
  { label: 'Total Leads',         value: m.totalLeads },
  { label: 'Campanhas Ativas',    value: m.activeCampaigns },
  { label: 'Msgs Geradas',        value: m.totalMessagesGenerated },
  { label: 'Msgs Enviadas',       value: m.totalMessagesSent },
]

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  if (metrics.totalLeads === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Sem leads ainda"
        description="Assim que os leads entrarem, os indicadores aparecem aqui."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards(metrics).map(({ label, value }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-xl p-5 transition-all"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-dim)',
          }}
        >
          {/* Amber corner accent */}
          <div
            className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
            style={{ backgroundColor: 'var(--amber)' }}
          />
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {label}
          </p>
          <p
            className="mt-3 font-mono text-3xl font-semibold tabular-nums"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: 'var(--amber)' }}
          />
        </div>
      ))}
    </div>
  )
}
