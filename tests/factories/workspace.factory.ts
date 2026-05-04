import { faker } from '@faker-js/faker'
import type { Workspace } from '@/types/app'

export function workspaceFactory(overrides?: Partial<Workspace>): Workspace {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name().toLowerCase()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}
