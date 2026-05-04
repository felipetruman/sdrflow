import type { Page } from '@playwright/test'

const NAV_ITEMS: Record<string, { label: string; href: string }> = {
  dashboard: { label: 'Dashboard', href: '/dashboard' },
  kanban: { label: 'Kanban', href: '/kanban' },
  'new-lead': { label: 'Novo Lead', href: '/leads/new' },
  campaigns: { label: 'Campanhas', href: '/campaigns' },
  funnel: { label: 'Funil', href: '/settings/funnel' },
  fields: { label: 'Campos', href: '/settings/fields' },
  members: { label: 'Membros', href: '/settings/members' },
}

export async function navigateTo(page: Page, target: string) {
  const item = NAV_ITEMS[target]
  if (!item) throw new Error(`Unknown nav target: ${target}`)
  await page.getByRole('link', { name: item.label, exact: false }).first().click()
  await page.waitForURL(`**${item.href}`)
}
