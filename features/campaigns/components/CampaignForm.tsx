'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { campaignSchema, type CampaignSchema } from '@/lib/validations/campaignSchema'
import { createCampaign } from '@/features/campaigns/actions/createCampaign'
import { updateCampaign } from '@/features/campaigns/actions/updateCampaign'
import type { Campaign, FunnelStage } from '@/types/app'
import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'
import { useToast } from '@/lib/hooks/useToast'

interface CampaignFormProps {
  campaign?: Campaign
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const [stages, setStages] = useState<FunnelStage[]>([])
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
      : {
          name: '',
          context: '',
          generation_prompt: '',
          trigger_stage_id: '',
          status: 'active',
        },
  })
  const errors = form.formState.errors

  useEffect(() => {
    const load = async () => {
      setStages(await getFunnelStages())
    }
    void load()
  }, [])

  const onSubmit = async (values: CampaignSchema) => {
    setLoading(true)
    const result = campaign
      ? await updateCampaign(campaign.id, values)
      : await createCampaign(values)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Campanha salva!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="editorial-card space-y-5 p-6">
      <Field label="Nome" required error={errors.name?.message}>
        <input
          {...form.register('name')}
          placeholder="Outbound Q2 2026"
          className="field"
        />
      </Field>

      <Field
        label="Contexto"
        helper="Descreva o ICP, dor e proposta de valor que a IA deve considerar."
        error={errors.context?.message}
      >
        <textarea
          {...form.register('context')}
          placeholder="Empresas SaaS B2B com 50–200 funcionários..."
          className="field min-h-24 resize-y"
        />
      </Field>

      <Field
        label="Prompt de geração"
        helper="Como a mensagem deve soar (tom, comprimento, CTA)."
        error={errors.generation_prompt?.message}
      >
        <textarea
          {...form.register('generation_prompt')}
          placeholder="Escreva uma mensagem curta..."
          className="field min-h-24 resize-y"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Estágio gatilho">
          <select {...form.register('trigger_stage_id')} className="field">
            <option value="">Sem estágio</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select {...form.register('status')} className="field">
            <option value="active">Ativa</option>
            <option value="inactive">Inativa</option>
          </select>
        </Field>
      </div>

      <div className="border-t-ink-700 flex justify-end border-t pt-5">
        <button type="submit" disabled={loading} className="btn-signal text-xs">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {campaign ? 'Salvar alterações' : 'Criar campanha'}
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: React.ReactNode
}

function Field({ label, required, helper, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-paper-muted flex items-baseline gap-1 font-mono text-2xs uppercase tracking-[0.14em]">
        {label}
        {required ? <span className="text-signal" aria-hidden>*</span> : null}
      </label>
      {helper ? <p className="text-paper-quiet text-xs">{helper}</p> : null}
      {children}
      {error ? <p className="text-negative text-xs">{error}</p> : null}
    </div>
  )
}
