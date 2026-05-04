'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { FunnelStage, LeadWithStage } from '@/types/app'
import { LeadCard } from './LeadCard'

type Props = {
  stage: FunnelStage
  leads: LeadWithStage[]
  onEditLead?: (lead: LeadWithStage) => void
  onDeleteLead?: (lead: LeadWithStage) => void
}

export function KanbanColumn({ stage, leads, onEditLead, onDeleteLead }: Props) {
  return (
    <div
      data-kanban-column
      className="flex w-full min-w-[272px] flex-col rounded-xl p-3"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-dim)',
      }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {stage.name}
        </h3>
        <span
          className="font-mono rounded-md px-2 py-0.5 text-xs font-medium tabular-nums"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: leads.length > 0 ? 'var(--amber)' : 'var(--text-muted)',
            border: '1px solid var(--border-dim)',
          }}
        >
          {leads.length}
        </span>
      </div>

      <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onEdit={onEditLead} onDelete={onDeleteLead} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
