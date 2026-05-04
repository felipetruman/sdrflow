import { faker } from '@faker-js/faker'
import type { Lead } from '@/types/app'

export function leadFactory(overrides: Partial<Lead> & { workspace_id: string; stage_id: string }): Lead {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    job_title: faker.person.jobTitle(),
    source: faker.helpers.arrayElement(['LinkedIn', 'Outbound', 'Indicação', 'Evento', 'Inbound', 'Webinar']),
    notes: faker.lorem.sentence(),
    owner_id: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function buildLeads(count: number, overrides: Partial<Lead> & { workspace_id: string; stage_id: string }): Lead[] {
  return Array.from({ length: count }, () => leadFactory(overrides))
}
