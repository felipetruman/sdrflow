import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { DashboardMetrics } from '@/types/app'

interface AdvancedMetricsProps {
  metrics: DashboardMetrics
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function AdvancedMetrics({ metrics }: AdvancedMetricsProps) {
  const { stageConversionRates, messagesByCampaign } = metrics

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {stageConversionRates && stageConversionRates.length > 0 ? (
        <ConversionRates rates={stageConversionRates} />
      ) : null}

      {messagesByCampaign && messagesByCampaign.length > 0 ? (
        <MessagesByCampaign data={messagesByCampaign} />
      ) : null}
    </div>
  )
}

interface ConversionRatesProps {
  rates: NonNullable<DashboardMetrics['stageConversionRates']>
}

function ConversionRates({ rates }: ConversionRatesProps) {
  return (
    <section className="editorial-card p-5">
      <header className="pb-4">
        <p className="eyebrow-quiet">Performance</p>
        <h3 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
          Conversão entre etapas
        </h3>
      </header>

      <div className="space-y-3">
        {rates.map((rate) => {
          const tone =
            rate.rate >= 70 ? 'positive' : rate.rate < 30 ? 'negative' : 'pending'
          const Icon =
            tone === 'positive' ? TrendingUp : tone === 'negative' ? TrendingDown : Minus
          const colorClass =
            tone === 'positive'
              ? 'text-positive'
              : tone === 'negative'
                ? 'text-negative'
                : 'text-pending'
          const barClass =
            tone === 'positive'
              ? 'bg-positive'
              : tone === 'negative'
                ? 'bg-negative'
                : 'bg-pending'

          return (
            <div key={`${rate.from_stage}-${rate.to_stage}`} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-paper-muted truncate">
                  {rate.from_stage}{' '}
                  <span className="text-paper-fade font-mono">→</span>{' '}
                  <span className="text-paper">{rate.to_stage}</span>
                </span>
                <span className={`num-tabular flex items-center gap-1 font-semibold ${colorClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {rate.rate}%
                </span>
              </div>
              <div className="bg-ink-700 h-1 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${barClass}`}
                  style={{ width: `${Math.min(rate.rate, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

interface MessagesByCampaignProps {
  data: NonNullable<DashboardMetrics['messagesByCampaign']>
}

function MessagesByCampaign({ data }: MessagesByCampaignProps) {
  const max = Math.max(1, ...data.map((item) => item.count))

  return (
    <section className="editorial-card p-5">
      <header className="pb-4">
        <p className="eyebrow-quiet">Outbound</p>
        <h3 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
          Mensagens por campanha
        </h3>
      </header>

      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.count / max) * 100
          return (
            <div key={item.campaign_id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-paper-muted truncate">{item.campaign_name}</span>
                <span className="text-paper num-tabular font-semibold">
                  {formatNumber(item.count)}
                </span>
              </div>
              <div className="bg-ink-700 h-1 overflow-hidden rounded-full">
                <div
                  className="bg-signal h-full rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
