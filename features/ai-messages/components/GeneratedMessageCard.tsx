'use client'

import { Copy, Send } from 'lucide-react'
import { copyMessage } from '@/features/ai-messages/actions/copyMessage'
import { sendSimulatedMessage } from '@/features/ai-messages/actions/sendSimulatedMessage'
import type { GeneratedMessage } from '@/types/app'

export function GeneratedMessageCard({ message }: { message: GeneratedMessage }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"><div className="flex items-center justify-between"><span className="text-xs font-medium uppercase text-slate-500">{message.status}</span><div className="flex gap-2"><button onClick={() => copyMessage(message.content)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><Copy className="h-4 w-4" />Copiar</button><button onClick={() => sendSimulatedMessage({ messageId: message.id })} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"><Send className="h-4 w-4" />Enviar</button></div></div><p className="whitespace-pre-wrap text-sm text-slate-700">{message.content}</p></div>
}
