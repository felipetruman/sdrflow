'use client'

import { useRouter } from 'next/navigation'
import { LeadForm } from './LeadForm'
import type { FunnelStage } from '@/types/app'

export function NewLeadPageClient({ stages }: { stages: FunnelStage[] }) {
  const router = useRouter()
  return <LeadForm stages={stages} onSuccess={() => router.push('/kanban')} />
}
