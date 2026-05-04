import { FunnelStageManager } from '@/features/funnel/components/FunnelStageManager'
import { StageRequiredFieldsPanel } from '@/features/funnel/components/StageRequiredFieldsPanel'

export default function FunnelSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <p className="eyebrow">Configuração</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Funil
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Defina as etapas do pipeline e os campos obrigatórios para avançar entre elas.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <section className="space-y-3">
        <p className="eyebrow-quiet">Etapas</p>
        <FunnelStageManager />
      </section>

      <section className="space-y-3">
        <p className="eyebrow-quiet">Campos obrigatórios por etapa</p>
        <StageRequiredFieldsPanel />
      </section>
    </div>
  )
}
