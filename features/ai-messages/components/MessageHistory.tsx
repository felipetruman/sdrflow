'use client'

import { useEffect, useMemo, useState } from 'react'
import { getGeneratedMessages } from '@/features/ai-messages/queries/getGeneratedMessages'
import type { GeneratedMessage } from '@/types/app'
import { EmptyState } from '@/components/EmptyState'
import { MessagesSquare } from 'lucide-react'

export function MessageHistory({ leadId }: { leadId: string }) {
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  useEffect(() => { void getGeneratedMessages(leadId).then(setMessages) }, [leadId])
  const grouped = useMemo(() => messages.reduce<Record<string, GeneratedMessage[]>>((acc, item) => { const key = item.campaign?.name ?? 'Sem campanha'; (acc[key] ??= []).push(item); return acc }, {}), [messages])
  if (messages.length === 0) return <EmptyState icon={MessagesSquare} title="Sem mensagens geradas" description="Os históricos de IA vão aparecer aqui." />
  return <div className="space-y-4">{Object.entries(grouped).map(([campaignName, items]) => <div key={campaignName} className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="mb-3 font-semibold">{campaignName}</h3><div className="space-y-2">{items.map((message) => <p key={message.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">{message.content}</p>)}</div></div>)}</div>
}
