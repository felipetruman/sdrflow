import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CampaignList } from '@/features/campaigns/components/CampaignList'

export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">Outbound</p>
          <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
            Campanhas
          </h1>
          <p className="text-paper-muted max-w-prose text-sm">
            Configure prompts de IA e gatilhos para automatizar mensagens por etapa do funil.
          </p>
        </div>
        <Link href="/campaigns/new" className="btn-signal self-start text-xs sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          Nova campanha
        </Link>
      </header>

      <div className="hairline" aria-hidden />

      <CampaignList />
    </div>
  )
}
