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
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10">
      {/* Editorial page header */}
      <header className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">Visão geral</p>
          <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="text-paper-muted max-w-prose text-sm">
            Métricas operacionais do funil em tempo real.
          </p>
        </div>
        <span className="chip self-start sm:self-auto">
          <span className="bg-signal h-1.5 w-1.5 animate-pulse rounded-full" aria-hidden />
          {dateLabel}
        </span>
      </header>

      <div className="hairline" aria-hidden />

      <MetricsCards metrics={metrics} />
      <LeadsByStageChart metrics={metrics} />
      <AdvancedMetrics metrics={metrics} />
    </div>
  )
}
