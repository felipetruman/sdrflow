'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createCustomField } from '@/features/custom-fields/actions/createCustomField'
import { updateCustomField } from '@/features/custom-fields/actions/updateCustomField'
import type { CustomField } from '@/types/app'
import { useToast } from '@/lib/hooks/useToast'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

interface CustomFieldFormProps {
  field?: CustomField
  onCreated?: () => void | Promise<void>
}

const FIELD_TYPES: CustomField['field_type'][] = ['text', 'number', 'date', 'boolean', 'select']

export function CustomFieldForm({ field, onCreated }: CustomFieldFormProps) {
  const [name, setName] = useState(field?.name ?? '')
  const [key, setKey] = useState(field?.key ?? '')
  const [fieldType, setFieldType] = useState<CustomField['field_type']>(
    field?.field_type ?? 'text',
  )
  const [options, setOptions] = useState((field?.options ?? []).join(', '))
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const parsedOptions = useMemo(
    () =>
      options
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [options],
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    const payload = {
      name,
      key,
      field_type: fieldType,
      options: fieldType === 'select' ? parsedOptions : null,
    }
    const result = field
      ? await updateCustomField({ id: field.id, ...payload })
      : await createCustomField(payload)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Campo salvo!')
      await onCreated?.()
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nome">
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setKey(slugify(event.target.value))
            }}
            placeholder="Segmento, Produto..."
            className="field"
          />
        </Field>
        <Field label="Chave">
          <input
            value={key}
            onChange={(event) => setKey(slugify(event.target.value))}
            placeholder="segmento"
            className="field font-mono text-xs"
          />
        </Field>
        <Field label="Tipo">
          <select
            value={fieldType}
            onChange={(event) =>
              setFieldType(event.target.value as CustomField['field_type'])
            }
            className="field"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        {fieldType === 'select' ? (
          <Field label="Opções">
            <input
              value={options}
              onChange={(event) => setOptions(event.target.value)}
              placeholder="A, B, C"
              className="field"
            />
          </Field>
        ) : null}
      </div>

      <div className="flex justify-end pt-1">
        <button type="submit" disabled={isPending} className="btn-signal text-xs">
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Salvar
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-paper-muted block font-mono text-2xs uppercase tracking-[0.14em]">
        {label}
      </label>
      {children}
    </div>
  )
}
