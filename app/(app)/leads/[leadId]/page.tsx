import { LeadDetailHeader } from '@/features/leads/components/LeadDetailHeader'
import { GenerateMessagesPanel } from '@/features/ai-messages/components/GenerateMessagesPanel'
import { ActivityTimeline } from '@/features/activities/components/ActivityTimeline'
import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'

interface Props {
  params: Promise<{ leadId: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { leadId } = await params
  const stages = await getFunnelStages()
  return (
    <div className="space-y-6 p-6">
      <LeadDetailHeader leadId={leadId} stages={stages} />
      <GenerateMessagesPanel leadId={leadId} />
      <ActivityTimeline leadId={leadId} />
    </div>
  )
}
