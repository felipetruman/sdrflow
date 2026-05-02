import { test, expect } from '../fixtures/auth'
import { DEMO_CAMPAIGNS } from '../helpers/demo-data'

test.describe('Campanhas', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/campaigns')
  })

  test('lista de campanhas renderiza heading e botão nova campanha', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: /campanhas/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /nova campanha/i })).toBeVisible()
  })

  test('campanhas demo aparecem na tabela', async ({ authenticatedPage: page }) => {
    for (const campaign of DEMO_CAMPAIGNS) {
      await expect(page.getByText(campaign.name)).toBeVisible()
    }
  })

  test('link nova campanha aponta para /campaigns/new', async ({ authenticatedPage: page }) => {
    const link = page.getByRole('link', { name: /nova campanha/i })
    await expect(link).toHaveAttribute('href', '/campaigns/new')
  })

  test('coluna status exibe badge para cada campanha', async ({ authenticatedPage: page }) => {
    for (const campaign of DEMO_CAMPAIGNS) {
      const row = page.locator('div').filter({ hasText: campaign.name }).filter({ has: page.locator('[class*="badge"], span') }).first()
      await expect(row).toBeVisible()
    }
  })
})
