'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { getGeneratedMessages } from '@/features/ai-messages/queries/getGeneratedMessages'
import type { GeneratedMessage } from '@/types/app'
import { EmptyState } from '@/components/EmptyState'

interface MessageHistoryProps {
  leadId: string
}

export function MessageHistory({ leadId }: MessageHistoryProps) {
  const [messages, setMessages] = useState<GeneratedMessage[] | null>(null)

  useEffect(() => {
    void getGeneratedMessages(leadId).then(setMessages)
  }, [leadId])

  const grouped = useMemo(() => {
    if (!messages) return {}
    return messages.reduce<Record<string, GeneratedMessage[]>>((acc, item) => {
      const key = item.campaign?.name ?? 'Sem campanha'
      ;(acc[key] ??= []).push(item)
      return acc
    }, {})
  }, [messages])

  return (
    <section className="editorial-card p-5">
      <header className="pb-4">
        <p className="eyebrow-quiet">Outbound</p>
        <h2 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
          Histórico de mensagens
        </h2>
      </header>

      {messages === null ? (
        <p className="text-paper-quiet text-sm">Carregando…</p>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Sem mensagens geradas"
          description="Os históricos de IA vão aparecer aqui."
        />
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([campaignName, items]) => (
            <div key={campaignName} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-paper text-sm font-medium tracking-tight">
                  {campaignName}
                </h3>
                <span className="text-paper-quiet num-tabular text-2xs">
                  {items.length} mensage{items.length === 1 ? 'm' : 'ns'}
                </span>
              </div>
              <ol className="space-y-2">
                {items.map((message) => (
                  <li
                    key={message.id}
                    className="bg-ink-900 border-ink-700 hover:border-ink-600 rounded-sm border p-3 transition-colors"
                  >
                    <p className="text-paper-muted whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
