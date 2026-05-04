'use client'

import { useEffect, useState } from 'react'
import { getWorkspaceMembers } from '@/features/workspaces/queries/getWorkspaceMembers'

interface LeadOwnerSelectProps {
  value?: string
  onChange: (value: string) => void
}

interface MemberOption {
  id: string
  label: string
}

export function LeadOwnerSelect({ value = '', onChange }: LeadOwnerSelectProps) {
  const [members, setMembers] = useState<MemberOption[]>([])

  useEffect(() => {
    void getWorkspaceMembers().then((items) => {
      setMembers(items.map((item) => ({ id: item.user_id, label: item.label })))
    })
  }, [])

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="field"
      aria-label="Responsável"
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
