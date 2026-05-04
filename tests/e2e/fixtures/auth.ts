import { test as base, expect, type Page } from '@playwright/test'

type Fixtures = { authenticatedPage: Page }

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    // In demo mode the middleware skips auth checks — navigate directly
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await use(page)
  },
})
export { expect }
