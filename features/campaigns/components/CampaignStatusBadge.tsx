import type { CampaignStatus } from '@/types/app'

interface CampaignStatusBadgeProps {
  status: CampaignStatus
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const isActive = status === 'active'
  return (
    <span className={`chip ${isActive ? 'chip-positive' : ''}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-positive' : 'bg-paper-fade'}`}
        aria-hidden
      />
      {isActive ? 'Ativa' : 'Inativa'}
    </span>
  )
}
