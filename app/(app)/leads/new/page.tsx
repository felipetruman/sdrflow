import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getFunnelStages } from '@/features/campaigns/queries/getFunnelStages'
import { NewLeadPageClient } from '@/features/leads/components/NewLeadPageClient'

export default async function NewLeadPage() {
  const stages = await getFunnelStages()
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <Link
          href="/kanban"
          className="text-paper-quiet hover:text-paper inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="font-mono uppercase tracking-[0.14em]">Kanban</span>
        </Link>
        <p className="eyebrow">Pipeline</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Novo Lead
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Cadastre um lead e atribua à etapa adequada do funil.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <NewLeadPageClient stages={stages} />
    </div>
  )
}
