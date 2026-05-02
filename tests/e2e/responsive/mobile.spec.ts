import { test, expect } from '../fixtures/auth'

const MOBILE_VIEWPORT = { width: 375, height: 812 }

test.describe('Responsividade — viewport mobile (375px)', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('login page renderiza corretamente em mobile', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 20)
  })

  test('dashboard não tem overflow horizontal em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/dashboard')
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 20)
  })

  test('kanban é utilizável em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/kanban')
    await expect(page.getByText('Marina Almeida')).toBeVisible()
  })

  test('formulário novo lead é utilizável em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/leads/new')
    await expect(page.getByPlaceholder('Nome *')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible()
  })

  test('sidebar/navegação é acessível em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/dashboard')
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()
  })

  test('página de campanhas não tem overflow horizontal em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/campaigns')
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 20)
  })

  test('página de configurações funil é utilizável em mobile', async ({ authenticatedPage: page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/settings/funnel')
    await expect(page.getByRole('button', { name: /nova etapa/i })).toBeVisible()
  })
})
