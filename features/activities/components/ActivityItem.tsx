import {
  CheckCircle2,
  MessageSquareWarning,
  PencilLine,
  Sparkles,
  Send,
  GitCommitVertical,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import type { LeadActivity } from '@/types/app'

type ActivityType = LeadActivity['type']

interface ActivityMeta {
  label: string
  icon: LucideIcon
  tone: 'positive' | 'pending' | 'negative' | 'info' | 'signal'
}

const map: Record<ActivityType, ActivityMeta> = {
  lead_created:           { label: 'Lead criado',         icon: CheckCircle2,         tone: 'positive' },
  lead_updated:           { label: 'Lead atualizado',     icon: PencilLine,           tone: 'info' },
  stage_changed:          { label: 'Etapa alterada',      icon: GitCommitVertical,    tone: 'signal' },
  message_generated:      { label: 'Mensagem gerada',     icon: Sparkles,             tone: 'signal' },
  message_sent:           { label: 'Mensagem enviada',    icon: Send,                 tone: 'positive' },
  auto_generation_failed: { label: 'Falha na geração',    icon: MessageSquareWarning, tone: 'negative' },
}

const toneClass: Record<ActivityMeta['tone'], { ring: string; bg: string; icon: string }> = {
  positive: { ring: 'border-positive/30', bg: 'bg-positive/10', icon: 'text-positive' },
  pending:  { ring: 'border-pending/30',  bg: 'bg-pending/10',  icon: 'text-pending' },
  negative: { ring: 'border-negative/30', bg: 'bg-negative/10', icon: 'text-negative' },
  info:     { ring: 'border-info/30',     bg: 'bg-info/10',     icon: 'text-info' },
  signal:   { ring: 'border-signal-deep', bg: 'bg-signal-bg',   icon: 'text-signal' },
}

interface ActivityItemProps {
  activity: LeadActivity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const meta = map[activity.type]
  const Icon = meta.icon
  const tone = toneClass[meta.tone]

  return (
    <div className="relative flex gap-3 pl-1">
      {/* Timeline dot */}
      <div
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${tone.ring} ${tone.bg}`}
      >
        <Icon className={`h-3.5 w-3.5 ${tone.icon}`} />
      </div>

      {/* Content */}
      <div className="bg-ink-900 border-ink-700 hover:border-ink-600 flex flex-1 items-center justify-between gap-3 rounded-sm border px-3 py-2 transition-colors">
        <p className="text-paper text-sm font-medium">{meta.label}</p>
        <time
          className="text-paper-quiet num-tabular shrink-0 text-2xs"
          dateTime={activity.created_at}
        >
          {formatDate(activity.created_at)}
        </time>
      </div>
    </div>
  )
}
