'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles, Cpu, FileText } from 'lucide-react'
import { getActiveCampaigns } from '@/features/campaigns/queries/getActiveCampaigns'
import { generateMessages } from '@/features/ai-messages/actions/generateMessages'
import { GeneratedMessageCard } from './GeneratedMessageCard'
import type { Campaign, GeneratedMessage } from '@/types/app'

interface GenerateMessagesPanelProps {
  leadId: string
}

type GenerationSource = 'llm' | 'fallback' | 'demo'

export function GenerateMessagesPanel({ leadId }: GenerateMessagesPanelProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<GenerationSource | null>(null)
  const [model, setModel] = useState<string | null>(null)

  useEffect(() => {
    void getActiveCampaigns().then((items) => {
      setCampaigns(items)
      setSelectedCampaignId(items[0]?.id ?? '')
    })
  }, [])

  async function handleGenerate() {
    if (!selectedCampaignId) return
    setLoading(true)
    const result = await generateMessages({ leadId, campaignId: selectedCampaignId })
    if (result.messages) {
      setMessages(result.messages)
      setSource(result.source ?? null)
      setModel(result.model ?? null)
    }
    setLoading(false)
  }

  const hasCampaigns = campaigns.length > 0

  return (
    <section className="editorial-card surface-grain p-5">
      <header className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-signal h-3.5 w-3.5" aria-hidden />
          <p className="eyebrow">Inteligência</p>
        </div>
        <h2 className="font-display text-paper mt-1 text-lg font-semibold tracking-tight">
          Gerar mensagens
        </h2>
        <p className="text-paper-muted mt-1 text-sm">
          Escolha uma campanha ativa e gere variações personalizadas para este lead.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          className="field flex-1"
          value={selectedCampaignId}
          onChange={(event) => setSelectedCampaignId(event.target.value)}
          aria-label="Campanha"
          disabled={!hasCampaigns}
        >
          {hasCampaigns ? (
            campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))
          ) : (
            <option value="">Nenhuma campanha ativa</option>
          )}
        </select>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !selectedCampaignId}
          className="btn-signal whitespace-nowrap text-xs"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? 'Gerando…' : 'Gerar mensagens'}
        </button>
      </div>

      {messages.length > 0 ? (
        <div className="border-t-ink-700 mt-5 space-y-3 border-t pt-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow-quiet">Recém-gerado</p>
            {source ? <SourceBadge source={source} model={model} /> : null}
          </div>
          {messages.map((message) => (
            <GeneratedMessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function SourceBadge({ source, model }: { source: GenerationSource; model: string | null }) {
  if (source === 'llm') {
    return (
      <span className="text-signal border-signal-deep inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase" style={{ backgroundColor: 'var(--signal-bg)' }}>
        <Cpu className="h-2.5 w-2.5" aria-hidden />
        IA · {model ?? 'modelo'}
      </span>
    )
  }
  return (
    <span className="text-paper-quiet border-ink-700 bg-ink-900 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
      <FileText className="h-2.5 w-2.5" aria-hidden />
      Template offline
    </span>
  )
}
