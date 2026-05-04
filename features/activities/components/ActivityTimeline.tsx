'use client'

import { useEffect, useState } from 'react'
import { ActivitySquare } from 'lucide-react'
import { getLeadActivities } from '@/features/activities/queries/getLeadActivities'
import type { LeadActivity } from '@/types/app'
import { ActivityItem } from './ActivityItem'
import { EmptyState } from '@/components/EmptyState'

interface ActivityTimelineProps {
  leadId: string
}

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const [items, setItems] = useState<LeadActivity[] | null>(null)

  useEffect(() => {
    void getLeadActivities(leadId).then(setItems)
  }, [leadId])

  return (
    <section className="editorial-card p-5">
      <header className="pb-5">
        <p className="eyebrow-quiet">Histórico</p>
        <h2 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
          Atividades
        </h2>
      </header>

      {items === null ? (
        <p className="text-paper-quiet text-sm">Carregando…</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ActivitySquare}
          title="Sem atividades"
          description="As interações deste lead aparecerão aqui."
        />
      ) : (
        <ol className="relative space-y-3">
          {/* Vertical timeline line */}
          <span
            className="bg-ink-700 absolute left-[14px] top-2 bottom-2 w-px"
            aria-hidden
          />
          {items.map((activity) => (
            <li key={activity.id}>
              <ActivityItem activity={activity} />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
