'use client'

import { useEffect, useState } from 'react'
import { getLeadActivities } from '@/features/activities/queries/getLeadActivities'
import type { LeadActivity } from '@/types/app'
import { ActivityItem } from './ActivityItem'
import { EmptyState } from '@/components/EmptyState'
import { ActivitySquare } from 'lucide-react'

export function ActivityTimeline({ leadId }: { leadId: string }) {
  const [items, setItems] = useState<LeadActivity[]>([])
  useEffect(() => { void getLeadActivities(leadId).then(setItems) }, [leadId])
  if (items.length === 0) return <EmptyState icon={ActivitySquare} title="Sem atividades" description="As interações deste lead aparecerão aqui." />
  return <div className="space-y-3">{items.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}</div>
}
