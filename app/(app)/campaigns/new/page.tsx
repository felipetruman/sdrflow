import { CampaignForm } from '@/features/campaigns/components/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nova campanha</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure contexto, prompt e estágio gatilho para gerar mensagens automaticamente.
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
