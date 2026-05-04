import { LeadDetailHeader } from '@/features/leads/components/LeadDetailHeader'
import { GenerateMessagesPanel } from '@/features/ai-messages/components/GenerateMessagesPanel'
import { MessageHistory } from '@/features/ai-messages/components/MessageHistory'
import { ActivityTimeline } from '@/features/activities/components/ActivityTimeline'
import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'

interface LeadDetailPageProps {
  params: Promise<{ leadId: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params
  const stages = await getFunnelStages()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <LeadDetailHeader leadId={leadId} stages={stages} />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(300px,360px)]">
        {/* Left column — operations */}
        <div className="min-w-0 space-y-6">
          <GenerateMessagesPanel leadId={leadId} />
          <MessageHistory leadId={leadId} />
        </div>

        {/* Right column — timeline (sticky on desktop) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ActivityTimeline leadId={leadId} />
        </aside>
      </div>
    </div>
  )
}
