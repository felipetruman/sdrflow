'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Save } from 'lucide-react'
import { createLead } from '@/features/leads/actions/createLead'
import { updateLead } from '@/features/leads/actions/updateLead'
import { updateLeadCustomValues } from '@/features/leads/actions/updateLeadCustomValues'
import { getCustomFields } from '@/features/custom-fields/queries/getCustomFields'
import { getLeadCustomValues } from '@/features/leads/queries/getLeadCustomValues'
import { DynamicCustomFieldInput } from '@/features/custom-fields/components/DynamicCustomFieldInput'
import { LeadOwnerSelect } from './LeadOwnerSelect'
import type { FunnelStage, CustomField } from '@/types/app'
import { leadSchema, type LeadSchema } from '@/lib/validations/leadSchema'

interface LeadFormProps {
  defaultValues?: Partial<LeadSchema>
  mode?: 'create' | 'edit'
  leadId?: string
  onSuccess?: () => void | Promise<void>
  stages?: FunnelStage[]
}

type CustomValue = string | boolean | number | null

export function LeadForm({
  defaultValues,
  mode = 'create',
  leadId,
  onSuccess,
  stages = [],
}: LeadFormProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [customValues, setCustomValues] = useState<Record<string, CustomValue>>({})
  const [isLoadingFields, setIsLoadingFields] = useState(true)

  const form = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      stage_id: '',
      phone: '',
      owner_id: '',
      ...defaultValues,
    } as LeadSchema,
  })

  useEffect(() => {
    async function load() {
      const fields = await getCustomFields()
      setCustomFields(fields)

      if (mode === 'edit' && leadId) {
        const values = await getLeadCustomValues(leadId)
        const mapped = Object.fromEntries(
          values.map((v) => [v.custom_field_id, v.value ?? null]),
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

  const errors = form.formState.errors

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome" required error={errors.name?.message}>
          <input
            {...form.register('name')}
            placeholder="Nome completo"
            className="field"
            aria-invalid={errors.name ? true : undefined}
          />
        </Field>

        <Field label="Etapa" required error={errors.stage_id?.message}>
          <select
            {...form.register('stage_id')}
            className="field"
            aria-invalid={errors.stage_id ? true : undefined}
          >
            <option value="">Selecione a etapa</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <input
            {...form.register('email')}
            type="email"
            placeholder="contato@empresa.com"
            className="field"
          />
        </Field>

        <Field label="Telefone" error={errors.phone?.message}>
          <input
            {...form.register('phone')}
            placeholder="(11) 99999-9999"
            className="field"
          />
        </Field>

        <Field label="Empresa">
          <input
            {...form.register('company')}
            placeholder="Acme Inc."
            className="field"
          />
        </Field>

        <Field label="Cargo">
          <input
            {...form.register('job_title')}
            placeholder="Head of Sales"
            className="field"
          />
        </Field>

        <Field label="Origem">
          <input
            {...form.register('source')}
            placeholder="LinkedIn, Indicação..."
            className="field"
          />
        </Field>

        <Field label="Responsável">
          <LeadOwnerSelect
            value={form.watch('owner_id') ?? ''}
            onChange={(value) => form.setValue('owner_id', value)}
          />
        </Field>
      </div>

      <Field label="Observações">
        <textarea
          {...form.register('notes')}
          placeholder="Notas internas, próximos passos..."
          className="field min-h-28 resize-y"
        />
      </Field>

      {isLoadingFields ? (
        <p className="text-paper-quiet text-sm">Carregando campos personalizados…</p>
      ) : customFields.length > 0 ? (
        <fieldset className="bg-ink-800 border-ink-700 space-y-4 rounded-sm border p-4">
          <legend className="eyebrow-quiet">Campos personalizados</legend>
          <div className="grid gap-4 md:grid-cols-2">
            {customFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-paper-muted block text-2xs font-mono uppercase tracking-[0.14em]">
                  {field.name}
                </label>
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
        </fieldset>
      ) : null}

      <div className="border-t-ink-700 flex justify-end border-t pt-5">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn-signal text-xs"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {mode === 'edit' ? 'Salvar alterações' : 'Criar lead'}
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-paper-muted flex items-baseline gap-1 font-mono text-2xs uppercase tracking-[0.14em]">
        {label}
        {required ? <span className="text-signal" aria-hidden>*</span> : null}
      </label>
      {children}
      {error ? <p className="text-negative text-xs">{error}</p> : null}
    </div>
  )
}
