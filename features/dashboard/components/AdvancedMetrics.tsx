'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { DashboardMetrics } from '@/types/app'

export function AdvancedMetrics({ metrics }: { metrics: DashboardMetrics }) {
  const { leadsLast7Days, leadsLast30Days, messagesByCampaign, stageConversionRates } = metrics

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Leads nos últimos 7 dias</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{leadsLast7Days ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Leads nos últimos 30 dias</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{leadsLast30Days ?? 0}</p>
        </div>
      </div>

      {stageConversionRates && stageConversionRates.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-800">Taxa de Conversão entre Etapas</h3>
          <div className="space-y-2">
            {stageConversionRates.map((item, idx) => {
              const isHigh = item.rate >= 70
              const isLow = item.rate < 30
              const Icon = isHigh ? TrendingUp : isLow ? TrendingDown : Minus
              const colorClass = isHigh ? 'text-green-600' : isLow ? 'text-red-500' : 'text-amber-500'
              const barColor = isHigh ? 'bg-green-500' : isLow ? 'bg-red-400' : 'bg-amber-400'
              return (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate text-slate-600">
                      {item.from_stage} → {item.to_stage}
                    </span>
                    <span className={`ml-2 flex items-center gap-1 font-medium ${colorClass}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {item.rate}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all`}
                      style={{ width: `${Math.min(item.rate, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {messagesByCampaign && messagesByCampaign.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-800">Mensagens por Campanha</h3>
          <div className="space-y-2">
            {messagesByCampaign.map((item) => {
              const max = messagesByCampaign[0]?.count ?? 1
              const pct = Math.round((item.count / max) * 100)
              return (
                <div key={item.campaign_id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate text-slate-700">{item.campaign_name}</span>
                    <span className="ml-2 font-medium text-slate-900">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width: `${pct}%` }}
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
