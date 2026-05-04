'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Building2, GripVertical, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LeadWithStage } from '@/types/app'

interface LeadCardProps {
  lead: LeadWithStage
  onEdit?: (lead: LeadWithStage) => void
  onDelete?: (lead: LeadWithStage) => void
}

function daysSince(iso: string | null | undefined): number {
  if (!iso) return 0
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  return Math.max(0, days)
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  })

  const days = daysSince(lead.updated_at ?? lead.created_at)
  const ageTone = days >= 14 ? 'text-negative' : days >= 7 ? 'text-pending' : 'text-paper-quiet'

  return (
    <article
      data-lead-card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="group bg-ink-900 hover:bg-ink-800 hover:border-ink-500 border-ink-700 relative rounded-md border p-3 shadow-1 transition-colors"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          aria-label="Arrastar lead"
          className="text-paper-fade group-hover:text-paper-quiet -ml-1 mt-0.5 shrink-0 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <div className="min-w-0 flex-1">
          <Link
            href={`/leads/${lead.id}`}
            className="block focus-visible:outline-none"
          >
            <h4 className="font-display text-paper truncate text-sm font-semibold tracking-tight">
              {lead.name}
            </h4>
            {lead.company || lead.job_title ? (
              <p className="text-paper-quiet mt-0.5 flex items-center gap-1 truncate text-xs">
                {lead.company ? (
                  <>
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </>
                ) : null}
                {lead.company && lead.job_title ? (
                  <span className="text-paper-fade">·</span>
                ) : null}
                {lead.job_title ? <span className="truncate">{lead.job_title}</span> : null}
              </p>
            ) : null}
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Ações para ${lead.name}`}
              className="text-paper-fade hover:text-paper hover:bg-ink-700 -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm opacity-0 transition-all group-hover:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/leads/${lead.id}`}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                Ver detalhes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEdit?.(lead)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-negative focus:text-negative"
              onSelect={() => {
                if (window.confirm(`Excluir "${lead.name}"?`)) onDelete?.(lead)
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <footer className="border-t-ink-700 mt-3 flex items-center justify-between gap-2 border-t pt-2">
        {lead.owner_id ? (
          <span
            aria-label="Responsável"
            className="bg-signal-bg text-signal border-signal-deep flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-2xs font-semibold"
            title={lead.owner_id}
          >
            {initials(lead.owner_id.slice(0, 2))}
          </span>
        ) : (
          <span className="text-paper-fade text-2xs uppercase tracking-[0.12em]">
            Sem dono
          </span>
        )}

        <div className="flex items-center gap-2">
          {lead.source ? (
            <span className="text-paper-quiet truncate font-mono text-2xs uppercase tracking-[0.12em]">
              {lead.source}
            </span>
          ) : null}
          <span className={`num-tabular text-2xs font-medium ${ageTone}`}>
            {days}d
          </span>
        </div>
      </footer>
    </article>
  )
}
