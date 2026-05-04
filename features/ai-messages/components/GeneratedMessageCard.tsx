'use client'

import { Copy, Send } from 'lucide-react'
import { copyMessage } from '@/features/ai-messages/actions/copyMessage'
import { sendSimulatedMessage } from '@/features/ai-messages/actions/sendSimulatedMessage'
import type { GeneratedMessage } from '@/types/app'

interface GeneratedMessageCardProps {
  message: GeneratedMessage
}

const statusTone: Record<string, string> = {
  draft:   'chip-pending',
  sent:    'chip-positive',
  failed:  'chip-negative',
  pending: 'chip-pending',
}

export function GeneratedMessageCard({ message }: GeneratedMessageCardProps) {
  const toneClass = statusTone[message.status] ?? 'chip'

  return (
    <article className="bg-ink-900 border-ink-700 hover:border-ink-600 rounded-sm border p-4 transition-colors">
      <div className="flex items-center justify-between gap-2 pb-3">
        <span className={`chip ${toneClass}`}>{message.status}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyMessage(message.content)}
            className="btn-ghost text-2xs"
          >
            <Copy className="h-3 w-3" />
            Copiar
          </button>
          <button
            type="button"
            onClick={() => sendSimulatedMessage({ messageId: message.id })}
            className="btn-signal text-2xs"
          >
            <Send className="h-3 w-3" />
            Enviar
          </button>
        </div>
      </div>
      <p className="text-paper-muted whitespace-pre-wrap text-sm leading-relaxed">
        {message.content}
      </p>
    </article>
  )
}
