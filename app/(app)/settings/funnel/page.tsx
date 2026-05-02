import { FunnelStageManager } from '@/features/funnel/components/FunnelStageManager'
import { StageRequiredFieldsPanel } from '@/features/funnel/components/StageRequiredFieldsPanel'

export default function FunnelSettingsPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Configuração do Funil</h1>
        <FunnelStageManager />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Campos Obrigatórios por Etapa</h2>
        <StageRequiredFieldsPanel />
      </div>
    </div>
  )
}
