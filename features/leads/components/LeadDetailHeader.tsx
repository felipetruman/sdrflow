'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Mail, Phone, Building2, Briefcase, MapPin, UserCircle, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getLeadById } from '@/features/leads/queries/getLeadById'
import type { Lead, FunnelStage } from '@/types/app'
import { LeadForm } from './LeadForm'
import { Skeleton } from '@/components/ui/skeleton'

interface LeadDetailHeaderProps {
  leadId: string
  stages: FunnelStage[]
}

interface ContactRow {
  icon: LucideIcon
  label: string
  value: string
}

function buildContactRows(lead: Lead): ContactRow[] {
  const rows: ContactRow[] = []
  if (lead.email) rows.push({ icon: Mail, label: 'E-mail', value: lead.email })
  if (lead.phone) rows.push({ icon: Phone, label: 'Telefone', value: lead.phone })
  if (lead.company) rows.push({ icon: Building2, label: 'Empresa', value: lead.company })
  if (lead.job_title) rows.push({ icon: Briefcase, label: 'Cargo', value: lead.job_title })
  if (lead.source) rows.push({ icon: MapPin, label: 'Origem', value: lead.source })
  if (lead.owner_id)
    rows.push({ icon: UserCircle, label: 'Responsável', value: `${lead.owner_id.slice(0, 8)}…` })
  return rows
}

export function LeadDetailHeader({ leadId, stages }: LeadDetailHeaderProps) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    void getLeadById(leadId).then(setLead)
  }, [leadId])

  if (!lead) {
    return (
      <div className="editorial-card space-y-3 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  if (editing) {
    return (
      <div className="editorial-card p-6">
        <LeadForm
          mode="edit"
          leadId={leadId}
          stages={stages}
          defaultValues={{
            ...lead,
            email: lead.email ?? '',
            phone: lead.phone ?? '',
            company: lead.company ?? '',
            job_title: lead.job_title ?? '',
            source: lead.source ?? '',
            notes: lead.notes ?? '',
            owner_id: lead.owner_id ?? '',
          }}
          onSuccess={() => {
            setEditing(false)
            void getLeadById(leadId).then(setLead)
          }}
        />
      </div>
    )
  }

  const stage = stages.find((s) => s.id === lead.stage_id)
  const rows = buildContactRows(lead)

  return (
    <article className="editorial-card overflow-hidden">
      {/* Top row: breadcrumb + edit */}
      <div className="border-b-ink-700 flex items-center justify-between gap-3 border-b px-5 py-3">
        <Link
          href="/kanban"
          className="text-paper-quiet hover:text-paper inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="font-mono uppercase tracking-[0.14em]">Kanban</span>
        </Link>
        <button onClick={() => setEditing(true)} className="btn-ghost text-xs">
          <Pencil className="h-3 w-3" />
          Editar lead
        </button>
      </div>

      {/* Hero */}
      <div className="space-y-3 p-6">
        <div className="flex items-start gap-3">
          {stage ? (
            <span
              className="chip mt-1.5"
              style={{
                color: stage.color || 'var(--signal)',
                borderColor: stage.color || 'var(--signal-deep)',
                backgroundColor: 'transparent',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: stage.color || 'var(--signal)' }}
                aria-hidden
              />
              {stage.name}
            </span>
          ) : null}
        </div>

        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          {lead.name}
        </h1>

        {/* Contact chips */}
        {rows.length > 0 ? (
          <dl className="border-t-ink-700 mt-5 grid gap-x-6 gap-y-3 border-t pt-5 sm:grid-cols-2">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="text-paper-quiet mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <div className="min-w-0">
                  <dt className="eyebrow-quiet">{label}</dt>
                  <dd className="text-paper mt-0.5 truncate text-sm">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Notes */}
        {lead.notes ? (
          <div className="bg-ink-800 border-ink-700 mt-5 flex items-start gap-3 rounded-sm border p-4">
            <FileText className="text-paper-quiet mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <p className="eyebrow-quiet">Observações</p>
              <p className="text-paper-muted text-sm leading-relaxed">{lead.notes}</p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}
