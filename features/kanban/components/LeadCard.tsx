'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Briefcase, Building2, Eye, GripVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { LeadWithStage } from '@/types/app'

type Props = {
  lead: LeadWithStage
  onEdit?: (lead: LeadWithStage) => void
  onDelete?: (lead: LeadWithStage) => void
}

export function LeadCard({ lead, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`block max-w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${isDragging ? 'opacity-60' : ''}`}>
      <div {...attributes} {...listeners} className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-900">{lead.name}</h4>
          {lead.company ? <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Building2 className="h-3.5 w-3.5" />{lead.company}</p> : null}
        </div>
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      {lead.job_title ? <p className="flex items-center gap-1 text-sm text-slate-600"><Briefcase className="h-3.5 w-3.5" />{lead.job_title}</p> : null}

      <div className="mt-4 flex items-center gap-2">
        <Link href={`/leads/${lead.id}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Link>
        <button
          type="button"
          onClick={() => onEdit?.(lead)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Tem certeza que deseja excluir "${lead.name}"?`)) {
              onDelete?.(lead)
            }
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir
        </button>
      </div>
    </div>
  )
}
