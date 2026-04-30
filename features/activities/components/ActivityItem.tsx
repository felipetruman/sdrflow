import { CheckCircle2, MessageSquareWarning, PencilLine, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import type { LeadActivity } from '@/types/app'

const map = { lead_created: { label: 'Lead criado', icon: CheckCircle2 }, lead_updated: { label: 'Lead atualizado', icon: PencilLine }, stage_changed: { label: 'Etapa alterada', icon: Sparkles }, message_generated: { label: 'Mensagem gerada', icon: Sparkles }, message_sent: { label: 'Mensagem enviada', icon: CheckCircle2 }, auto_generation_failed: { label: 'Falha na geração', icon: MessageSquareWarning } } as const

export function ActivityItem({ activity }: { activity: LeadActivity }) {
  const item = map[activity.type]
  const Icon = item.icon
  return <div className="flex gap-3 rounded-lg border bg-white p-3"><Icon className="h-5 w-5" /><div><div className="text-sm font-medium">{item.label}</div><div className="text-xs text-slate-500">{formatDate(activity.created_at)}</div></div></div>
}
