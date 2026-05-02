import { expect, test } from '../fixtures/auth'

test.describe('Dashboard page', () => {
  test('shows heading and 4 metric cards', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    // 4 metric cards
    await expect(page.getByText('Total Leads')).toBeVisible()
    await expect(page.getByText('Campanhas Ativas')).toBeVisible()
    await expect(page.getByText('Mensagens Geradas')).toBeVisible()
    await expect(page.getByText('Mensagens Enviadas')).toBeVisible()
  })

  test('shows Leads por estágio section with stage names', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Leads por estágio' })).toBeVisible()

    // Verify stage bars exist (at least one stage has leads in demo data)
    const stageRows = page.locator('h2:has-text("Leads por estágio") + div > div')
    await expect(stageRows.first()).toBeVisible()
    const count = await stageRows.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('shows Taxa de Conversão entre Etapas with percentage values', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Taxa de Conversão entre Etapas' })).toBeVisible()

    // Percentage values appear as "XX%" — verify at least one exists
    const percentageBars = page.locator('text=/%$/')
    await expect(percentageBars.first()).toBeVisible()
  })

  test('shows 7 dias and 30 dias metric cards', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await expect(page.getByText('Leads nos últimos 7 dias')).toBeVisible()
    await expect(page.getByText('Leads nos últimos 30 dias')).toBeVisible()
  })

  test('shows Mensagens por Campanha section', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Mensagens por Campanha' })).toBeVisible()

    // Campaign names should appear in the section
    const campaignBars = page.locator('h3:has-text("Mensagens por Campanha") + div > div')
    const count = await campaignBars.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})
