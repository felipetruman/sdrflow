'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { campaignSchema, type CampaignSchema } from '@/lib/validations/campaignSchema'
import { createCampaign } from '@/features/campaigns/actions/createCampaign'
import { updateCampaign } from '@/features/campaigns/actions/updateCampaign'
import type { Campaign, FunnelStage } from '@/types/app'
import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'
import { useToast } from '@/lib/hooks/useToast'

type Props = { campaign?: Campaign }

export function CampaignForm({ campaign }: Props) {
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<CampaignSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign
      ? {
          name: campaign.name,
          context: campaign.context,
          generation_prompt: campaign.generation_prompt,
          trigger_stage_id: campaign.trigger_stage_id ?? '',
          status: campaign.status,
        }
      : { name: '', context: '', generation_prompt: '', trigger_stage_id: '', status: 'active' },
  })

  useEffect(() => {
    const load = async () => {
      setStages(await getFunnelStages())
    }
    void load()
  }, [])

  const onSubmit = async (values: CampaignSchema) => {
    setLoading(true); setMessage(null)
    const result = campaign ? await updateCampaign(campaign.id, values) : await createCampaign(values)
    if (result.error) { setMessage(result.error); toast.error(result.error) } else { setMessage('Salvo com sucesso'); toast.success('Campanha salva!') }
    setLoading(false)
  }

  return <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"><div><label className="mb-1 block text-sm font-medium">Nome</label><input className="w-full rounded-lg border px-3 py-2" {...form.register('name')} /></div><div><label className="mb-1 block text-sm font-medium">Contexto</label><textarea className="min-h-28 w-full rounded-lg border px-3 py-2" {...form.register('context')} /></div><div><label className="mb-1 block text-sm font-medium">Prompt de geração</label><textarea className="min-h-28 w-full rounded-lg border px-3 py-2" {...form.register('generation_prompt')} /></div><div className="grid gap-4 md:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Estágio gatilho</label><select className="w-full rounded-lg border px-3 py-2" {...form.register('trigger_stage_id')}><option value="">Sem estágio</option>{stages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}</select></div><div><label className="mb-1 block text-sm font-medium">Status</label><select className="w-full rounded-lg border px-3 py-2" {...form.register('status')}><option value="active">Ativa</option><option value="inactive">Inativa</option></select></div></div><button disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{loading ? 'Salvando...' : 'Salvar campanha'}</button>{message ? <p className="text-sm text-slate-600">{message}</p> : null}</form>
}
