import { faker } from '@faker-js/faker'
import type { FunnelStage } from '@/types/app'

export function funnelStageFactory(overrides: Partial<FunnelStage> & { workspace_id: string }): FunnelStage {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Base', 'Qualificado', 'Proposta', 'Negociação', 'Fechamento']),
    order_index: faker.number.int({ min: 1, max: 10 }),
    color: faker.color.rgb(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}
