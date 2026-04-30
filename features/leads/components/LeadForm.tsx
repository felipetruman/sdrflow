'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createLead } from '@/features/leads/actions/createLead'
import { updateLead } from '@/features/leads/actions/updateLead'
import type { FunnelStage } from '@/types/app'
import { leadSchema, type LeadSchema } from '@/lib/validations/leadSchema'

type Props = { defaultValues?: Partial<LeadSchema>; mode?: 'create' | 'edit'; leadId?: string; onSuccess?: () => void | Promise<void>; stages?: FunnelStage[] }

export function LeadForm({ defaultValues, mode = 'create', leadId, onSuccess, stages = [] }: Props) {
  const form = useForm<LeadSchema>({ resolver: zodResolver(leadSchema), defaultValues: { name: '', stage_id: '', ...defaultValues } as LeadSchema })
  const submit = form.handleSubmit(async (values) => {
    const result = mode === 'edit' && leadId ? await updateLead(leadId, values) : await createLead(values)
    if (!result.error) await onSuccess?.()
  })
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input {...form.register('name')} placeholder="Nome" className="rounded-lg border border-slate-300 px-3 py-2" />
        <select {...form.register('stage_id')} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="">Selecione a etapa</option>
          {stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
        </select>
        <input {...form.register('email')} placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('company')} placeholder="Empresa" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('job_title')} placeholder="Cargo" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('source')} placeholder="Origem" className="rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <textarea {...form.register('notes')} placeholder="Observações" className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2" />
      <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Salvar</button>
    </form>
  )
}
