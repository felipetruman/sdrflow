'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createLead } from '@/features/leads/actions/createLead'
import { updateLead } from '@/features/leads/actions/updateLead'
import { updateLeadCustomValues } from '@/features/leads/actions/updateLeadCustomValues'
import { getCustomFields } from '@/features/custom-fields/queries/getCustomFields'
import { getLeadCustomValues } from '@/features/leads/queries/getLeadCustomValues'
import { DynamicCustomFieldInput } from '@/features/custom-fields/components/DynamicCustomFieldInput'
import { LeadOwnerSelect } from './LeadOwnerSelect'
import type { FunnelStage, CustomField } from '@/types/app'
import { leadSchema, type LeadSchema } from '@/lib/validations/leadSchema'

type Props = {
  defaultValues?: Partial<LeadSchema>
  mode?: 'create' | 'edit'
  leadId?: string
  onSuccess?: () => void | Promise<void>
  stages?: FunnelStage[]
}

export function LeadForm({ defaultValues, mode = 'create', leadId, onSuccess, stages = [] }: Props) {
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [customValues, setCustomValues] = useState<Record<string, string | boolean | number | null>>({})
  const [isLoadingFields, setIsLoadingFields] = useState(true)

  const form = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', stage_id: '', phone: '', owner_id: '', ...defaultValues } as LeadSchema,
  })

  useEffect(() => {
    async function load() {
      const fields = await getCustomFields()
      setCustomFields(fields)

      if (mode === 'edit' && leadId) {
        const values = await getLeadCustomValues(leadId)
        const mapped = Object.fromEntries(
          values.map((v) => [v.custom_field_id, v.value ?? null])
        )
        setCustomValues(mapped)
      }

      setIsLoadingFields(false)
    }
    void load()
  }, [leadId, mode])

  const submit = form.handleSubmit(async (values) => {
    const result =
      mode === 'edit' && leadId
        ? await updateLead(leadId, values)
        : await createLead(values)

    if (result.error) return

    const newLeadId = result.data?.id
    if (newLeadId || leadId) {
      const stringValues: Record<string, string> = {}
      for (const [key, val] of Object.entries(customValues)) {
        stringValues[key] = val === null || val === undefined ? '' : String(val)
      }
      if (Object.keys(stringValues).length > 0) {
        await updateLeadCustomValues(newLeadId || leadId!, stringValues)
      }
    }

    await onSuccess?.()
  })

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input {...form.register('name')} placeholder="Nome *" className="rounded-lg border border-slate-300 px-3 py-2" />
        <select {...form.register('stage_id')} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="">Selecione a etapa *</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>{stage.name}</option>
          ))}
        </select>
        <input {...form.register('email')} placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('phone')} placeholder="Telefone" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('company')} placeholder="Empresa" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('job_title')} placeholder="Cargo" className="rounded-lg border border-slate-300 px-3 py-2" />
        <input {...form.register('source')} placeholder="Origem" className="rounded-lg border border-slate-300 px-3 py-2" />
        <LeadOwnerSelect value={form.watch('owner_id') ?? ''} onChange={(value) => form.setValue('owner_id', value)} />
      </div>
      <textarea {...form.register('notes')} placeholder="Observações" className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2" />

      {isLoadingFields ? (
        <p className="text-sm text-slate-500">Carregando campos personalizados...</p>
      ) : customFields.length > 0 ? (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-700">Campos personalizados</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {customFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-xs font-medium text-slate-600">{field.name}</label>
                <DynamicCustomFieldInput
                  field={field}
                  value={customValues[field.id] ?? null}
                  onChange={(val) =>
                    setCustomValues((prev) => ({ ...prev, [field.id]: val }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Salvar
      </button>
    </form>
  )
}
