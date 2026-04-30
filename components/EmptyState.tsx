'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center"><Icon className="mb-4 h-10 w-10 text-slate-400" /><h3 className="text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>{action ? <div className="mt-4">{action}</div> : null}</div>
}
