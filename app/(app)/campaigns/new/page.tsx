import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CampaignForm } from '@/features/campaigns/components/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <Link
          href="/campaigns"
          className="text-paper-quiet hover:text-paper inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="font-mono uppercase tracking-[0.14em]">Campanhas</span>
        </Link>
        <p className="eyebrow">Outbound</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Nova campanha
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Configure contexto, prompt e estágio gatilho para gerar mensagens automaticamente.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <CampaignForm />
    </div>
  )
}
