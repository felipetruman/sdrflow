import { CampaignList } from '@/features/campaigns/components/CampaignList'

export default function CampaignsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Campanhas</h1>
      <CampaignList />
    </div>
  )
}
