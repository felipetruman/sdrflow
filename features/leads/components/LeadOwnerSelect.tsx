'use client'

import { useEffect, useState } from 'react'
import { getWorkspaceMembers } from '@/features/workspaces/queries/getWorkspaceMembers'

type Props = {
  value?: string
  onChange: (value: string) => void
}

type MemberOption = { id: string; label: string }

export function LeadOwnerSelect({ value = '', onChange }: Props) {
  const [members, setMembers] = useState<MemberOption[]>([])

  useEffect(() => {
    void getWorkspaceMembers().then((items) => {
      setMembers(items.map((item) => ({ id: item.user_id, label: item.user_id })))
    })
  }, [])

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-2"
    >
      <option value="">Sem responsável</option>
      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.label}
        </option>
      ))}
    </select>
  )
}
