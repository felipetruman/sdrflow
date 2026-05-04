'use client'

import { Users, Megaphone, Sparkles, Send, Inbox } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { DashboardMetrics } from '@/types/app'

const cards = (m: DashboardMetrics) => [
  { label: 'Total Leads',      Icon: Users,     value: m.totalLeads,              accent: 'amber' as const },
  { label: 'Campanhas Ativas', Icon: Megaphone, value: m.activeCampaigns,         accent: 'cyan'  as const },
  { label: 'Msgs Geradas',     Icon: Sparkles,  value: m.totalMessagesGenerated,   accent: 'amber' as const },
  { label: 'Msgs Enviadas',    Icon: Send,      value: m.totalMessagesSent,        accent: 'cyan'  as const },
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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards(metrics).map(({ label, Icon, value, accent }) => {
        const isAmber = accent === 'amber'
        const color      = isAmber ? 'var(--amber)'    : 'var(--cyan)'
        const colorGlow  = isAmber ? 'var(--amber-glow)' : 'var(--cyan-glow)'
        const colorBorder = isAmber
          ? 'rgba(245,158,11,0.25)'
          : 'rgba(6,182,212,0.25)'
        const shadowHover = isAmber
          ? '0 0 0 1px var(--amber), 0 0 28px var(--amber-glow)'
          : '0 0 0 1px var(--cyan),  0 0 28px var(--cyan-glow)'

        return (
          <div
            key={label}
            className="group relative overflow-hidden rounded-xl p-5 transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-dim)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = color
              e.currentTarget.style.boxShadow   = shadowHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-dim)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            {/* Icon box */}
            <div
              className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: colorGlow,
                border: `1px solid ${colorBorder}`,
              }}
            >
              <Icon className="h-[18px] w-[18px]" style={{ color }} />
            </div>

            {/* Label */}
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </p>

            {/* Number */}
            <p
              className="mt-1 font-mono text-5xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {value}
            </p>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: color }}
            />
          </div>
        )
      })}
    </div>
  )
}
