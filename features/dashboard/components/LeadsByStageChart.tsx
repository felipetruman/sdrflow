'use client'

import type { DashboardMetrics } from '@/types/app'

export function LeadsByStageChart({ metrics }: { metrics: DashboardMetrics }) {
  const max = Math.max(1, ...metrics.leadsByStage.map((item) => item.count))

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-dim)',
      }}
    >
      <h2
        className="font-display mb-5 text-base font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        Leads por estágio
      </h2>

      {metrics.leadsByStage.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Sem dados ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {metrics.leadsByStage.map((item) => {
            const pct = (item.count / max) * 100
            return (
              <div key={item.stage_id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.stage_name}
                  </span>
                  <span
                    className="font-mono text-sm font-medium tabular-nums"
                    style={{ color: 'var(--amber)' }}
                  >
                    {item.count}
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, var(--amber-dim), var(--amber))`,
                      boxShadow: pct > 60 ? '0 0 8px var(--amber-glow)' : 'none',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
