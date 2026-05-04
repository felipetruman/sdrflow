import { MetricsCards } from '@/features/dashboard/components/MetricsCards'
import { LeadsByStageChart } from '@/features/dashboard/components/LeadsByStageChart'
import { AdvancedMetrics } from '@/features/dashboard/components/AdvancedMetrics'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()

  const dateLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div
        className="flex items-end justify-between pb-5"
        style={{ borderBottom: '1px solid var(--border-dim)' }}
      >
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: 'var(--amber)' }}
          >
            Visão Geral
          </p>
          <h1
            className="mt-1 font-display text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Dashboard
          </h1>
        </div>
        <div
          className="rounded-full px-3 py-1.5 font-mono text-[11px]"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-dim)',
          }}
        >
          {dateLabel}
        </div>
      </div>

      <MetricsCards metrics={metrics} />
      <LeadsByStageChart metrics={metrics} />
      <AdvancedMetrics metrics={metrics} />
    </div>
  )
}
