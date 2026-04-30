'use client'

import { useEffect, useState } from 'react'
import { getCustomFields } from '@/features/custom-fields/queries/getCustomFields'
import type { CustomField } from '@/types/app'
import { EmptyState } from '@/components/EmptyState'
import { FileQuestion } from 'lucide-react'

export function CustomFieldList() {
  const [fields, setFields] = useState<CustomField[]>([])

  useEffect(() => {
    void getCustomFields().then(setFields)
  }, [])

  if (fields.length === 0) return <EmptyState icon={FileQuestion} title="Sem campos personalizados" description="Adicione campos para enriquecer seus leads." />

  return <div className="space-y-3">{fields.map((field) => <div key={field.id} className="rounded-lg border p-4"><div className="font-medium">{field.name}</div><div className="text-sm text-slate-500">{field.key} · {field.field_type}</div></div>)}</div>
}
