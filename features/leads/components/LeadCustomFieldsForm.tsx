'use client'

import { useEffect, useState } from 'react'
import { updateLeadCustomValues } from '@/features/leads/actions/updateLeadCustomValues'
import { getLeadCustomValues } from '@/features/leads/queries/getLeadCustomValues'

export function LeadCustomFieldsForm({ leadId }: { leadId: string }) {
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => { void getLeadCustomValues(leadId).then((items) => setValues(Object.fromEntries(items.map((item) => [item.custom_field_id, item.value ?? ''])))) }, [leadId])
  return <form onSubmit={async (e) => { e.preventDefault(); await updateLeadCustomValues(leadId, values) }} className="rounded-xl border p-4"><button className="rounded bg-slate-900 px-3 py-2 text-white">Salvar campos</button></form>
}
