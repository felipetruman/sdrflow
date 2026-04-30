'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit3, Plus } from 'lucide-react'
import { getCampaigns } from '@/features/campaigns/queries/getCampaigns'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import type { Campaign } from '@/types/app'

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => { void getCampaigns().then(setCampaigns) }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Gerencie campanhas de geração automática.</p>
        <Link href="/campaigns/new" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          <Plus className="h-4 w-4" /> Nova campanha
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
          <div className="col-span-5">Nome</div><div className="col-span-2">Status</div><div className="col-span-3">Trigger</div><div className="col-span-2 text-right">Ações</div>
        </div>
        {campaigns.length === 0 ? <div className="px-4 py-8 text-sm text-slate-500">Nenhuma campanha encontrada.</div> : campaigns.map(c => <div key={c.id} className="grid grid-cols-12 items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0"><div className="col-span-5 font-medium text-slate-900">{c.name}</div><div className="col-span-2"><CampaignStatusBadge status={c.status} /></div><div className="col-span-3 text-sm text-slate-600">{c.trigger_stage_id ?? 'Sem estágio'}</div><div className="col-span-2 flex justify-end"><Link href={`/campaigns/${c.id}/edit`} className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"><Edit3 className="h-4 w-4" /> Editar</Link></div></div>)}
      </div>
    </div>
  )
}
