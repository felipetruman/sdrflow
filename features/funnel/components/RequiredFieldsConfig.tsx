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

export function RequiredFieldsConfig({ stageId, requiredFields, customFields }: { stageId: string; requiredFields: StageRequiredField[]; customFields: CustomField[] }) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => { setSelected(requiredFields.map((field) => `${field.is_custom_field ? 'custom' : 'standard'}:${field.field_key}`)) }, [requiredFields])

  const toggle = async (key: string) => {
    const next = selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]
    setSelected(next)
    await updateStageRequiredFields({ stageId, fields: next.map((item) => { const [type, field_key] = item.split(':'); return { field_key, is_custom_field: type === 'custom' } }) })
  }

  return <div className="space-y-4 rounded-xl border p-4"><div><h4 className="font-semibold">Campos padrão</h4><div className="mt-2 grid gap-2">{standardFields.map((field) => <label key={field.field_key} className="flex items-center gap-2"><input type="checkbox" checked={selected.includes(`standard:${field.field_key}`)} onChange={() => toggle(`standard:${field.field_key}`)} />{field.label}</label>)}</div></div><div><h4 className="font-semibold">Campos customizados</h4><div className="mt-2 grid gap-2">{customFields.map((field) => <label key={field.id} className="flex items-center gap-2"><input type="checkbox" checked={selected.includes(`custom:${field.key}`)} onChange={() => toggle(`custom:${field.key}`)} />{field.name}</label>)}</div></div></div>
}
