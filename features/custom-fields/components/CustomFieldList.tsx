'use client'

import { useEffect, useState } from 'react'
import { FileQuestion, Plus } from 'lucide-react'
import { getCustomFields } from '@/features/custom-fields/queries/getCustomFields'
import type { CustomField } from '@/types/app'
import { EmptyState } from '@/components/EmptyState'
import { CustomFieldForm } from './CustomFieldForm'

export function CustomFieldList() {
  const [fields, setFields] = useState<CustomField[]>([])
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const data = await getCustomFields()
    setFields(data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-paper-quiet num-tabular text-xs">
          <span className="text-paper font-semibold">{fields.length}</span> campo
          {fields.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-signal text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          {showForm ? 'Cancelar' : 'Novo campo'}
        </button>
      </div>

      {showForm ? (
        <div className="editorial-card p-4">
          <CustomFieldForm
            onCreated={async () => {
              setShowForm(false)
              await load()
            }}
          />
        </div>
      ) : null}

      {fields.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title="Sem campos personalizados"
          description="Adicione campos para enriquecer seus leads."
        />
      ) : (
        <ul className="space-y-2">
          {fields.map((field) => (
            <li
              key={field.id}
              className="bg-ink-900 border-ink-700 hover:border-ink-600 flex items-center justify-between gap-3 rounded-sm border px-4 py-3 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-paper truncate text-sm font-medium tracking-tight">
                  {field.name}
                </p>
                <p className="text-paper-quiet truncate font-mono text-2xs uppercase tracking-[0.12em]">
                  {field.key} · {field.field_type}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
