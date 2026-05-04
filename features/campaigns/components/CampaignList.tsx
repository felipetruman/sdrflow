'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit3, Plus, Megaphone } from 'lucide-react'
import { getCampaigns } from '@/features/campaigns/queries/getCampaigns'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import type { Campaign } from '@/types/app'
import { EmptyState } from '@/components/EmptyState'

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    void getCampaigns().then(setCampaigns)
  }, [])

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Nenhuma campanha"
        description="Crie sua primeira campanha para automatizar mensagens."
        action={
          <Link href="/campaigns/new" className="btn-signal text-xs">
            <Plus className="h-3.5 w-3.5" />
            Nova campanha
          </Link>
        }
      />
    )
  }

  return (
    <div className="editorial-card overflow-hidden">
      {/* Table header */}
      <div className="bg-ink-800 border-b-ink-700 grid grid-cols-12 gap-4 border-b px-4 py-3">
        <div className="eyebrow-quiet col-span-5">Nome</div>
        <div className="eyebrow-quiet col-span-2">Status</div>
        <div className="eyebrow-quiet col-span-3">Trigger</div>
        <div className="eyebrow-quiet col-span-2 text-right">Ações</div>
      </div>

      {/* Table rows */}
      <ul className="divide-ink-700 divide-y">
        {campaigns.map((campaign) => (
          <li
            key={campaign.id}
            className="hover:bg-ink-800 grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors"
          >
            <div className="col-span-5 min-w-0">
              <p className="font-display text-paper truncate text-sm font-medium tracking-tight">
                {campaign.name}
              </p>
            </div>
            <div className="col-span-2">
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <div className="text-paper-quiet col-span-3 truncate font-mono text-xs">
              {campaign.trigger_stage_id ?? '—'}
            </div>
            <div className="col-span-2 flex justify-end">
              <Link
                href={`/campaigns/${campaign.id}/edit`}
                className="text-paper-muted hover:text-signal inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <Edit3 className="h-3 w-3" />
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
