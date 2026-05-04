import { faker } from '@faker-js/faker'
import type { Campaign } from '@/types/app'

export function campaignFactory(overrides: Partial<Campaign> & { workspace_id: string }): Campaign {
  return {
    id: faker.string.uuid(),
    name: `Campanha ${faker.commerce.productName()}`,
    context: faker.lorem.paragraphs(2),
    generation_prompt: 'Você é um SDR experiente. Use tom consultivo. Personalize com base nos dados do lead.',
    trigger_stage_id: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}
