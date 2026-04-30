'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getActiveCampaigns } from '@/features/campaigns/queries/getActiveCampaigns'
import { generateMessages } from '@/features/ai-messages/actions/generateMessages'
import { GeneratedMessageCard } from './GeneratedMessageCard'
import type { Campaign, GeneratedMessage } from '@/types/app'

export function GenerateMessagesPanel({ leadId }: { leadId: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { void getActiveCampaigns().then((items) => { setCampaigns(items); setSelectedCampaignId(items[0]?.id ?? '') }) }, [])

  const handleGenerate = async () => { if (!selectedCampaignId) return; setLoading(true); const result = await generateMessages({ leadId, campaignId: selectedCampaignId }); if (result.messages) setMessages(result.messages); setLoading(false) }

  return <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex gap-3"><select className="flex-1 rounded-lg border px-3 py-2" value={selectedCampaignId} onChange={(e) => setSelectedCampaignId(e.target.value)}>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button onClick={handleGenerate} disabled={loading || !selectedCampaignId} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Gerar Mensagens</button></div><div className="space-y-3">{messages.map((message) => <GeneratedMessageCard key={message.id} message={message} />)}</div></div>
}
