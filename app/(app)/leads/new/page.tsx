import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'
import { NewLeadPageClient } from '@/features/leads/components/NewLeadPageClient'

export default async function NewLeadPage() {
  const stages = await getFunnelStages()
  return <div className="p-6"><h1 className="mb-6 text-2xl font-bold">Novo Lead</h1><NewLeadPageClient stages={stages} /></div>
}
