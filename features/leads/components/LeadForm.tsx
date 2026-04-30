'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createLead } from '@/features/leads/actions/createLead'
import { updateLead } from '@/features/leads/actions/updateLead'
import { leadSchema, type LeadSchema } from '@/lib/validations/leadSchema'

type Props = { defaultValues?: Partial<LeadSchema>; mode?: 'create' | 'edit'; leadId?: string; onSuccess?: () => void | Promise<void> }

export function LeadForm({ defaultValues, mode = 'create', leadId, onSuccess }: Props) {
  const form = useForm<LeadSchema>({ resolver: zodResolver(leadSchema), defaultValues: { name: '', stage_id: '', ...defaultValues } as LeadSchema })
  const submit = form.handleSubmit(async (values) => {
    const result = mode === 'edit' && leadId ? await updateLead(leadId, values) : await createLead(values)
    if (!result.error) await onSuccess?.()
  })
  return <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Salvar</button></form>
}
