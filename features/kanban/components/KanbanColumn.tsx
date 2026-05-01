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
    <div className="flex w-full min-w-[280px] flex-col rounded-2xl bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{stage.name}</h3>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">{leads.length}</span>
      </div>
      <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3">
          {leads.map((lead) => <LeadCard key={lead.id} lead={lead} onEdit={onEditLead} onDelete={onDeleteLead} />)} 
        </div>
      </SortableContext>
    </div>
  )
}
