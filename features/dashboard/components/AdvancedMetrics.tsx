'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { DashboardMetrics } from '@/types/app'

export function AdvancedMetrics({ metrics }: { metrics: DashboardMetrics }) {
  const { leadsLast7Days, leadsLast30Days, messagesByCampaign, stageConversionRates } = metrics

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Leads nos últimos 7 dias</p>
          <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{leadsLast7Days ?? 0}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Leads nos últimos 30 dias</p>
          <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{leadsLast30Days ?? 0}</p>
        </div>
      </div>

      {stageConversionRates && stageConversionRates.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
          <h3 className="mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Taxa de Conversão entre Etapas</h3>
          <div className="space-y-2">
            {stageConversionRates.map((item, idx) => {
              const isHigh = item.rate >= 70
              const isLow = item.rate < 30
              const Icon = isHigh ? TrendingUp : isLow ? TrendingDown : Minus
              const barColor = isHigh ? 'var(--success)' : isLow ? 'var(--error)' : 'var(--amber)'
              const textColor = isHigh ? 'var(--success)' : isLow ? 'var(--error)' : 'var(--amber)'
              return (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>
                      {item.from_stage} → {item.to_stage}
                    </span>
                    <span className="ml-2 flex items-center gap-1 font-medium" style={{ color: textColor }}>
                      <Icon className="h-3.5 w-3.5" />
                      {item.rate}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--bg-base)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(item.rate, 100)}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {messagesByCampaign && messagesByCampaign.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
          <h3 className="mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Mensagens por Campanha</h3>
          <div className="space-y-2">
            {messagesByCampaign.map((item) => {
              const max = messagesByCampaign[0]?.count ?? 1
              const pct = Math.round((item.count / max) * 100)
              return (
                <div key={item.campaign_id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{item.campaign_name}</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--bg-base)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: 'var(--cyan)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
