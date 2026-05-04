'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { FunnelStage, LeadWithStage } from '@/types/app'
import { LeadCard } from './LeadCard'

interface KanbanColumnProps {
  stage: FunnelStage
  leads: LeadWithStage[]
  onEditLead?: (lead: LeadWithStage) => void
  onDeleteLead?: (lead: LeadWithStage) => void
}

export function KanbanColumn({ stage, leads, onEditLead, onDeleteLead }: KanbanColumnProps) {
  const isEmpty = leads.length === 0

  return (
    <div
      data-kanban-column
      className="bg-ink-900 border-ink-700 flex w-full min-w-[280px] flex-col rounded-md border"
    >
      {/* Sticky header */}
      <header className="bg-ink-900 border-b-ink-700 sticky top-0 z-10 flex items-center justify-between gap-2 rounded-t-md border-b px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="bg-signal h-1.5 w-1.5 shrink-0 rounded-full"
            aria-hidden
          />
          <h2 className="font-display text-paper truncate text-sm font-semibold tracking-tight">
            {stage.name}
          </h2>
          <span
            className={`num-tabular text-xs font-medium ${
              isEmpty ? 'text-paper-fade' : 'text-signal'
            }`}
          >
            {leads.length}
          </span>
        </div>
        <Link
          href={`/leads/new?stage=${stage.id}`}
          aria-label={`Adicionar lead em ${stage.name}`}
          className="text-paper-quiet hover:text-signal hover:bg-ink-800 -mr-1 flex h-6 w-6 items-center justify-center rounded-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Cards */}
      <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2 p-2">
          {isEmpty ? (
            <div className="border-ink-700 text-paper-fade flex h-24 items-center justify-center rounded-sm border border-dashed text-2xs uppercase tracking-[0.12em]">
              Vazio
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={onEditLead}
                onDelete={onDeleteLead}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
