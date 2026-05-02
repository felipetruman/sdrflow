import { MetricsCards } from '@/features/dashboard/components/MetricsCards'
import { LeadsByStageChart } from '@/features/dashboard/components/LeadsByStageChart'
import { AdvancedMetrics } from '@/features/dashboard/components/AdvancedMetrics'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <MetricsCards metrics={metrics} />
      <LeadsByStageChart metrics={metrics} />
      <AdvancedMetrics metrics={metrics} />
    </div>
  )
}
