'use client'

import { useEffect, useState } from 'react'
import { getLeadById } from '@/features/leads/queries/getLeadById'
import type { Lead } from '@/types/app'
import { LeadForm } from './LeadForm'

export function LeadDetailHeader({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [editing, setEditing] = useState(false)
  useEffect(() => { void getLeadById(leadId).then(setLead) }, [leadId])
  if (!lead) return <div className="rounded-xl border p-4">Carregando...</div>
  if (editing) return <LeadForm mode="edit" leadId={leadId} defaultValues={{ ...lead, email: lead.email ?? '', phone: lead.phone ?? '', company: lead.company ?? '', job_title: lead.job_title ?? '', source: lead.source ?? '', notes: lead.notes ?? '', owner_id: lead.owner_id ?? '' }} onSuccess={() => setEditing(false)} />
  return <div className="rounded-xl border bg-white p-4 shadow-sm"><button onClick={() => setEditing(true)} className="text-sm text-slate-600">Editar</button><div>{lead.name}</div></div>
}
