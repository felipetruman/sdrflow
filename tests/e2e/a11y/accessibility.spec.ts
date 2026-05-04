import { test, expect } from '../fixtures/auth'

const PAGES = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/kanban', name: 'Kanban' },
  { path: '/campaigns', name: 'Campanhas' },
  { path: '/leads/new', name: 'Novo Lead' },
  { path: '/settings/funnel', name: 'Configurações Funil' },
]

test.describe('Acessibilidade — ARIA e navegação por teclado', () => {
  for (const { path, name } of PAGES) {
    test(`${name} — navegação principal via role=navigation`, async ({ authenticatedPage: page }) => {
      await page.goto(path)
      await expect(page.getByRole('navigation').first()).toBeVisible()
    })

    test(`${name} — tem ao menos um landmark main ou region`, async ({ authenticatedPage: page }) => {
      await page.goto(path)
      // WorkspaceGuard renders "Carregando..." before main appears — auto-wait
      const main = page.getByRole('main')
      try {
        await expect(main).toBeVisible({ timeout: 10000 })
      } catch {
        // Fallback: accept role=region if main is not present
        await expect(page.getByRole('region').first()).toBeVisible({ timeout: 5000 })
      }
    })
  }

  test('Login — campos têm labels associadas', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
  })

  test('Login — botão submit tem nome acessível', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('Dashboard — cards de métricas são identificáveis', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')
    // Wait for workspace to load (WorkspaceGuard)
    await expect(page.getByRole('main')).toBeVisible({ timeout: 10000 })
    const cards = page.locator('[class*="card"], [class*="metric"], [class*="stat"]')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Kanban — colunas têm headings de estágio', async ({ authenticatedPage: page }) => {
    await page.goto('/kanban')
    // Wait for demo leads to appear (ensures columns rendered)
    await expect(page.getByText('Marina Almeida')).toBeVisible({ timeout: 10000 })
    const headings = page.getByRole('heading')
    const count = await headings.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('Formulário Novo Lead — botão submit tem role button', async ({ authenticatedPage: page }) => {
    await page.goto('/leads/new')
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'submit')
  })

  test('Sidebar — links de navegação são acessíveis por teclado', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')
    const sidebar = page.getByRole('navigation').first()
    // Wait for sidebar to render with links
    await expect(sidebar.getByRole('link').first()).toBeVisible({ timeout: 10000 })
    const count = await sidebar.getByRole('link').count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('Imagens sem src ou com alt vazio não causam falha de acessibilidade crítica', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('main')).toBeVisible({ timeout: 10000 })
    const imgsWithoutAlt = await page.locator('img:not([alt])').count()
    expect(imgsWithoutAlt).toBe(0)
  })
})
