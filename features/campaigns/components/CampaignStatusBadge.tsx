'use client'

import type { CampaignStatus } from '@/types/app'

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const styles = status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
  const label = status === 'active' ? 'Ativa' : 'Inativa'

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>{label}</span>
}
