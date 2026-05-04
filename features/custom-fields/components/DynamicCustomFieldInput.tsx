'use client'

import type { CustomField } from '@/types/app'

type FieldValue = string | boolean | number | null

interface DynamicCustomFieldInputProps {
  field: CustomField
  value: FieldValue | undefined
  onChange: (value: FieldValue) => void
}

export function DynamicCustomFieldInput({
  field,
  value,
  onChange,
}: DynamicCustomFieldInputProps) {
  if (field.field_type === 'boolean') {
    return (
      <label className="bg-ink-900 border-ink-700 hover:border-ink-600 flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 transition-colors">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="accent-signal h-3.5 w-3.5 cursor-pointer"
        />
        <span className="text-paper-muted text-sm">{value ? 'Sim' : 'Não'}</span>
      </label>
    )
  }

  if (field.field_type === 'select') {
    return (
      <select
        value={(value as string) ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        <option value="">Selecione…</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  const inputType =
    field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'

  return (
    <input
      type={inputType}
      value={(value as string | number | undefined) ?? ''}
      onChange={(event) =>
        onChange(
          field.field_type === 'number' ? Number(event.target.value) : event.target.value,
        )
      }
      className="field"
    />
  )
}
