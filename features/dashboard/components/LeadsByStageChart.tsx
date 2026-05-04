import type { DashboardMetrics } from '@/types/app'

interface LeadsByStageChartProps {
  metrics: DashboardMetrics
}

const TICK_COUNT = 24

export function LeadsByStageChart({ metrics }: LeadsByStageChartProps) {
  const max = Math.max(1, ...metrics.leadsByStage.map((item) => item.count))
  const total = metrics.leadsByStage.reduce((acc, item) => acc + item.count, 0)

  return (
    <section className="editorial-card p-5">
      <header className="flex items-end justify-between pb-5">
        <div>
          <p className="eyebrow-quiet">Distribuição por etapa</p>
          <h2 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
            Leads no funil
          </h2>
        </div>
        <span className="chip">{total} leads</span>
      </header>

      {metrics.leadsByStage.length === 0 ? (
        <p className="text-paper-quiet text-sm">Sem dados ainda.</p>
      ) : (
        <div className="space-y-4">
          {metrics.leadsByStage.map((item) => {
            const ratio = item.count / max
            const filledTicks = Math.max(0, Math.round(ratio * TICK_COUNT))
            const sharePct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0'

            return (
              <div key={item.stage_id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
                <div className="font-display text-paper truncate text-sm font-medium">
                  {item.stage_name}
                </div>
                <div className="num-tabular text-signal text-sm font-semibold">
                  {item.count}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-[2px]">
                    {Array.from({ length: TICK_COUNT }).map((_, idx) => {
                      const isFilled = idx < filledTicks
                      return (
                        <span
                          key={idx}
                          className={`h-2 flex-1 rounded-xs transition-colors ${
                            isFilled ? 'bg-signal' : 'bg-ink-700'
                          }`}
                          aria-hidden
                        />
                      )
                    })}
                  </div>
                  <span className="text-paper-quiet num-tabular w-12 text-right text-2xs">
                    {sharePct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
