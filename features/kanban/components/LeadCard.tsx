'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Briefcase, Building2, GripVertical } from 'lucide-react'
import Link from 'next/link'
import type { LeadWithStage } from '@/types/app'

export function LeadCard({ lead }: { lead: LeadWithStage }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  return (
    <Link ref={setNodeRef} href={`/leads/${lead.id}`} style={{ transform: CSS.Transform.toString(transform), transition }} className={`block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${isDragging ? 'opacity-60' : ''}`}>
      <div {...attributes} {...listeners} className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">{lead.name}</h4>
          {lead.company ? <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Building2 className="h-3.5 w-3.5" />{lead.company}</p> : null}
        </div>
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      {lead.job_title ? <p className="flex items-center gap-1 text-sm text-slate-600"><Briefcase className="h-3.5 w-3.5" />{lead.job_title}</p> : null}
    </Link>
  )
}
