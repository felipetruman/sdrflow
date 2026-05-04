import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border-ink-700 bg-ink-900/30 flex flex-col items-center justify-center rounded-md border border-dashed px-6 py-12 text-center">
      <div className="bg-ink-800 border-ink-700 text-paper-quiet mb-4 flex h-11 w-11 items-center justify-center rounded-sm border">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-paper text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-paper-muted mt-1.5 max-w-md text-sm">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
