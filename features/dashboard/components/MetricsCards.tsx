import { Megaphone, Sparkles, Send, ArrowUpRight, Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { DashboardMetrics } from '@/types/app'

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatPercent(numerator: number, denominator: number): string {
  if (denominator === 0) return '—'
  const ratio = (numerator / denominator) * 100
  return `${ratio.toFixed(1)}%`
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const {
    totalLeads,
    leadsLast7Days,
    leadsLast30Days,
    activeCampaigns,
    totalMessagesGenerated,
    totalMessagesSent,
  } = metrics

  if (totalLeads === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Sem leads ainda"
        description="Assim que os leads entrarem, os indicadores aparecem aqui."
      />
    )
  }

  const sendRate = formatPercent(totalMessagesSent, totalMessagesGenerated)
  const weeklyShare = totalLeads > 0 ? Math.round((leadsLast7Days / totalLeads) * 100) : 0

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {/* Hero — Total Leads (col-span-2 on lg) */}
      <article className="editorial-card relative overflow-hidden p-6 lg:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow-quiet">Pipeline total</p>
            <p className="text-paper-muted mt-1 text-sm">Leads ativos no funil</p>
          </div>
          <span className="chip chip-signal">
            <ArrowUpRight className="h-3 w-3" />
            +{leadsLast7Days} esta semana
          </span>
        </div>

        <div className="mt-8 flex items-end justify-between gap-6">
          <p className="num-display text-paper text-5xl font-semibold">
            {formatNumber(totalLeads)}
          </p>
          <div className="flex flex-col items-end gap-1 pb-2">
            <span className="text-paper-quiet font-mono text-2xs uppercase tracking-[0.16em]">
              30 dias
            </span>
            <span className="num-tabular text-paper text-lg font-medium">
              +{formatNumber(leadsLast30Days)}
            </span>
          </div>
        </div>

        {/* Distribution sliver — visual hint of weekly share */}
        <div className="mt-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-paper-quiet font-mono text-2xs uppercase tracking-[0.14em]">
              Captura semanal
            </span>
            <span className="num-tabular text-paper-muted text-2xs">
              {weeklyShare}% do total
            </span>
          </div>
          <div className="bg-ink-800 h-1 overflow-hidden rounded-full">
            <div
              className="bg-signal h-full rounded-full"
              style={{ width: `${Math.min(weeklyShare, 100)}%` }}
            />
          </div>
        </div>
      </article>

      {/* Sub-metrics — stacked */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <SubMetric
          eyebrow="Campanhas"
          label="ativas"
          value={formatNumber(activeCampaigns)}
          icon={Megaphone}
        />
        <SubMetric
          eyebrow="Mensagens"
          label="geradas"
          value={formatNumber(totalMessagesGenerated)}
          icon={Sparkles}
        />
        <SubMetric
          eyebrow="Envio"
          label={`${sendRate} taxa`}
          value={formatNumber(totalMessagesSent)}
          icon={Send}
        />
      </div>
    </div>
  )
}

interface SubMetricProps {
  eyebrow: string
  label: string
  value: string
  icon: LucideIcon
}

function SubMetric({ eyebrow, label, value, icon: Icon }: SubMetricProps) {
  return (
    <article className="editorial-card flex items-center gap-4 p-4">
      <div className="bg-signal-bg border-signal-deep text-signal flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow-quiet truncate">{eyebrow}</p>
        <p className="num-display text-paper mt-0.5 text-2xl font-semibold">{value}</p>
        <p className="text-paper-quiet mt-0.5 truncate text-2xs uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>
    </article>
  )
}
