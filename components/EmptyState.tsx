'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-6 py-12 text-center"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-base)',
      }}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3
        className="font-display text-base font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
