import { StageRequiredFieldsPanel } from '@/features/funnel/components/StageRequiredFieldsPanel'

export default function FunnelSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Configuração do Funil</h1>
      <StageRequiredFieldsPanel />
    </div>
  )
}
