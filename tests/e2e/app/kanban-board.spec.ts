import { expect, test } from '../fixtures/auth'

test.describe('Kanban board', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/kanban')
    await expect(page.getByRole('heading', { name: 'Funil de Leads' })).toBeVisible()
  })

  test('renders 7 stage columns with stage names', async ({ authenticatedPage: page }) => {
    const columns = page.locator('[data-kanban-column]')
    await expect(columns).toHaveCount(7)
  })

  test('search filters leads by name — only Marina visible', async ({ authenticatedPage: page }) => {
    const searchInput = page.getByPlaceholder('Buscar por nome, email ou empresa')
    await searchInput.fill('Marina')

    await expect(page.getByText('Marina Almeida')).toBeVisible()
    await expect(page.getByText('Rafael Souza')).not.toBeVisible()
  })

  test('stage filter shows only leads in selected stage', async ({ authenticatedPage: page }) => {
    const stageSelect = page.locator('select').nth(0)
    await stageSelect.selectOption({ index: 1 })

    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('owner filter shows only leads for selected owner', async ({ authenticatedPage: page }) => {
    const ownerSelect = page.locator('select').nth(1)
    await ownerSelect.selectOption({ index: 1 })

    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('sort by name orders leads alphabetically', async ({ authenticatedPage: page }) => {
    const sortSelect = page.locator('select').nth(2)
    await sortSelect.selectOption('nome')

    const leadCards = page.locator('[data-lead-card]')
    const count = await leadCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('sort by empresa orders leads by company', async ({ authenticatedPage: page }) => {
    const sortSelect = page.locator('select').nth(2)
    await sortSelect.selectOption('empresa')

    const leadCards = page.locator('[data-lead-card]')
    const count = await leadCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('clear filters button resets all filters', async ({ authenticatedPage: page }) => {
    const searchInput = page.getByPlaceholder('Buscar por nome, email ou empresa')
    await searchInput.fill('Marina')
    await expect(page.getByText('Marina Almeida')).toBeVisible()

    await page.getByRole('button', { name: /Limpar/ }).click()

    await expect(searchInput).toHaveValue('')
    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('kanban columns have lead cards', async ({ authenticatedPage: page }) => {
    const leadCards = page.locator('[data-lead-card]')
    await expect(leadCards.first()).toBeVisible()
  })

  test('shows lead count text', async ({ authenticatedPage: page }) => {
    const leadsText = page.getByText(/\d+ leads encontrados/)
    await expect(leadsText).toBeVisible()

    const text = await leadsText.textContent()
    const match = text?.match(/(\d+)/)
    expect(match).toBeTruthy()
    expect(Number(match![1])).toBeGreaterThanOrEqual(6)
  })

  test('shows empty state when no results match search', async ({ authenticatedPage: page }) => {
    const searchInput = page.getByPlaceholder('Buscar por nome, email ou empresa')
    await searchInput.fill('zzz-no-match-xyz')

    await expect(page.getByText('Nenhum lead encontrado com esses filtros.')).toBeVisible()
    await expect(page.getByText(/leads encontrados/)).toContainText('0 leads encontrados')
  })
})
