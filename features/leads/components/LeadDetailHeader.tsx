'use client'

import { useEffect, useState } from 'react'
import { getLeadById } from '@/features/leads/queries/getLeadById'
import type { Lead, FunnelStage } from '@/types/app'
import { LeadForm } from './LeadForm'
import { Pencil, Mail, Phone, Building2, Briefcase, MapPin, FileText, UserCircle } from 'lucide-react'

export function LeadDetailHeader({ leadId, stages }: { leadId: string; stages: FunnelStage[] }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [editing, setEditing] = useState(false)
  useEffect(() => { void getLeadById(leadId).then(setLead) }, [leadId])
  if (!lead) return <div className="rounded-xl border p-4">Carregando...</div>
  if (editing) return <LeadForm mode="edit" leadId={leadId} stages={stages} defaultValues={{ ...lead, email: lead.email ?? '', phone: lead.phone ?? '', company: lead.company ?? '', job_title: lead.job_title ?? '', source: lead.source ?? '', notes: lead.notes ?? '', owner_id: lead.owner_id ?? '' }} onSuccess={() => { setEditing(false); void getLeadById(leadId).then(setLead) }} />

  const stage = stages.find((s) => s.id === lead.stage_id)

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
          {stage && (
            <span
              className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: stage.color || '#64748b' }}
            >
              {stage.name}
            </span>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" /> Editar
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-slate-400" />
            {lead.email}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-slate-400" />
            {lead.phone}
          </div>
        )}
        {lead.company && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="h-4 w-4 text-slate-400" />
            {lead.company}
          </div>
        )}
        {lead.job_title && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="h-4 w-4 text-slate-400" />
            {lead.job_title}
          </div>
        )}
        {lead.source && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            Origem: {lead.source}
          </div>
        )}
        {lead.owner_id && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <UserCircle className="h-4 w-4 text-slate-400" />
            Responsável: {lead.owner_id.slice(0, 8)}...
          </div>
        )}
      </div>

      {lead.notes && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          {lead.notes}
        </div>
      )}
    </div>
  )
}
