'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { createCustomField } from '@/features/custom-fields/actions/createCustomField'
import { updateCustomField } from '@/features/custom-fields/actions/updateCustomField'
import type { CustomField } from '@/types/app'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

export function CustomFieldForm({ field }: { field?: CustomField }) {
  const [name, setName] = useState(field?.name ?? '')
  const [key, setKey] = useState(field?.key ?? '')
  const [fieldType, setFieldType] = useState<CustomField['field_type']>(field?.field_type ?? 'text')
  const [options, setOptions] = useState((field?.options ?? []).join(', '))

  const parsedOptions = useMemo(() => options.split(',').map((item) => item.trim()).filter(Boolean), [options])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = { name, key, field_type: fieldType, options: fieldType === 'select' ? parsedOptions : null }
    if (field) await updateCustomField({ id: field.id, ...payload })
    else await createCustomField(payload)
  }

  return <form onSubmit={submit} className="space-y-3 rounded-xl border p-4"><input className="w-full rounded border p-2" value={name} onChange={(e) => { setName(e.target.value); setKey(slugify(e.target.value)) }} placeholder="Nome" /><input className="w-full rounded border p-2" value={key} onChange={(e) => setKey(slugify(e.target.value))} placeholder="Chave" /><select className="w-full rounded border p-2" value={fieldType} onChange={(e) => setFieldType(e.target.value as CustomField['field_type'])}>{['text','number','date','boolean','select'].map((type) => <option key={type} value={type}>{type}</option>)}</select>{fieldType === 'select' ? <textarea className="w-full rounded border p-2" value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Opções separadas por vírgula" /> : null}<button className="rounded bg-slate-900 px-4 py-2 text-white">Salvar</button></form>
}
