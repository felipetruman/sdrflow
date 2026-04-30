'use client'

import type { CustomField } from '@/types/app'

export function DynamicCustomFieldInput({ field, value, onChange }: { field: CustomField; value: string | boolean | number | null | undefined; onChange: (value: string | boolean | number | null) => void }) {
  if (field.field_type === 'boolean') return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
  if (field.field_type === 'select') return <select value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>{(field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select>
  return <input type={field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'} value={(value as string | number | undefined) ?? ''} onChange={(e) => onChange(field.field_type === 'number' ? Number(e.target.value) : e.target.value)} />
}
