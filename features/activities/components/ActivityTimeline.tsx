'use client'

import { useEffect, useState } from 'react'
import { getLeadActivities } from '@/features/activities/queries/getLeadActivities'
import type { LeadActivity } from '@/types/app'
import { ActivityItem } from './ActivityItem'

export function ActivityTimeline({ leadId }: { leadId: string }) {
  const [items, setItems] = useState<LeadActivity[]>([])
  useEffect(() => { void getLeadActivities(leadId).then(setItems) }, [leadId])
  return <div className="space-y-3">{items.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}</div>
}
