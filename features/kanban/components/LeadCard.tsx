'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Building2, Eye, GripVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { LeadWithStage } from '@/types/app'

type Props = {
  lead: LeadWithStage
  onEdit?: (lead: LeadWithStage) => void
  onDelete?: (lead: LeadWithStage) => void
}

export function LeadCard({ lead, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-dim)',
        opacity: isDragging ? 0.5 : 1,
      }}
      className="group relative rounded-xl p-3 transition-all hover:border-[var(--border-bright)]"
    >
      {/* Drag handle + name row */}
      <div
        {...attributes}
        {...listeners}
        className="mb-2 flex items-start gap-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical
          className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-30 group-hover:opacity-60"
          style={{ color: 'var(--text-muted)' }}
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-white">{lead.name}</h4>
          {lead.company ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.company}</span>
            </p>
          ) : null}
        </div>
      </div>

      {lead.job_title ? (
        <p className="mb-3 truncate text-xs" style={{ color: 'var(--text-secondary)' }}>
          {lead.job_title}
        </p>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Link
          href={`/leads/${lead.id}`}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
          style={{
            backgroundColor: 'var(--bg-overlay)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-dim)',
          }}
        >
          <Eye className="h-3 w-3" />
          Ver
        </Link>
        <button
          type="button"
          onClick={() => onEdit?.(lead)}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
          style={{
            backgroundColor: 'var(--bg-overlay)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-dim)',
          }}
        >
          <Pencil className="h-3 w-3" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Excluir "${lead.name}"?`)) onDelete?.(lead)
          }}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            color: 'var(--error)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <Trash2 className="h-3 w-3" />
          Excluir
        </button>
      </div>

      {/* Amber left glow on hover */}
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: 'var(--amber)' }}
      />
    </div>
  )
}
