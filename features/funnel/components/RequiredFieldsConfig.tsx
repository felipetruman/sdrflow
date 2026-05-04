'use client'

import { useEffect, useState } from 'react'
import { updateStageRequiredFields } from '@/features/funnel/actions/updateStageRequiredFields'
import type { CustomField, StageRequiredField } from '@/types/app'

const standardFields = [
  { field_key: 'name', label: 'Nome' },
  { field_key: 'email', label: 'Email' },
  { field_key: 'phone', label: 'Telefone' },
  { field_key: 'company', label: 'Empresa' },
  { field_key: 'job_title', label: 'Cargo' },
  { field_key: 'source', label: 'Origem' },
]

interface RequiredFieldsConfigProps {
  stageId: string
  requiredFields: StageRequiredField[]
  customFields: CustomField[]
}

export function RequiredFieldsConfig({
  stageId,
  requiredFields,
  customFields,
}: RequiredFieldsConfigProps) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected(
      requiredFields.map(
        (field) => `${field.is_custom_field ? 'custom' : 'standard'}:${field.field_key}`,
      ),
    )
  }, [requiredFields])

  async function toggle(key: string) {
    const next = selected.includes(key)
      ? selected.filter((item) => item !== key)
      : [...selected, key]
    setSelected(next)
    await updateStageRequiredFields({
      stageId,
      fields: next.map((item) => {
        const [type, field_key] = item.split(':')
        return { field_key, is_custom_field: type === 'custom' }
      }),
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow-quiet mb-3">Campos padrão</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {standardFields.map((field) => (
            <CheckboxRow
              key={field.field_key}
              label={field.label}
              checked={selected.includes(`standard:${field.field_key}`)}
              onToggle={() => toggle(`standard:${field.field_key}`)}
            />
          ))}
        </div>
      </div>

      {customFields.length > 0 ? (
        <div>
          <p className="eyebrow-quiet mb-3">Campos customizados</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {customFields.map((field) => (
              <CheckboxRow
                key={field.id}
                label={field.name}
                checked={selected.includes(`custom:${field.key}`)}
                onToggle={() => toggle(`custom:${field.key}`)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface CheckboxRowProps {
  label: string
  checked: boolean
  onToggle: () => void
}

function CheckboxRow({ label, checked, onToggle }: CheckboxRowProps) {
  return (
    <label
      className={`bg-ink-900 border-ink-700 hover:border-ink-600 flex cursor-pointer items-center gap-2.5 rounded-sm border px-3 py-2 text-sm transition-colors ${
        checked ? 'border-signal-deep bg-signal-bg' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="accent-signal h-3.5 w-3.5 shrink-0 cursor-pointer"
      />
      <span className={checked ? 'text-paper' : 'text-paper-muted'}>{label}</span>
    </label>
  )
}
