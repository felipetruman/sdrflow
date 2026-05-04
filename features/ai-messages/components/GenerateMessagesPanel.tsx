'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { getActiveCampaigns } from '@/features/campaigns/queries/getActiveCampaigns'
import { generateMessages } from '@/features/ai-messages/actions/generateMessages'
import { GeneratedMessageCard } from './GeneratedMessageCard'
import type { Campaign, GeneratedMessage } from '@/types/app'

interface GenerateMessagesPanelProps {
  leadId: string
}

export function GenerateMessagesPanel({ leadId }: GenerateMessagesPanelProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [loading, setLoading] = useState(false)

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
    if (result.messages) setMessages(result.messages)
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
          <p className="eyebrow-quiet">Recém-gerado</p>
          {messages.map((message) => (
            <GeneratedMessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
