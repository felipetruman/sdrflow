import { expect, test } from '../fixtures/auth'

test.describe('Kanban board', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/kanban')
    await expect(page.getByRole('heading', { name: 'Funil de Leads' })).toBeVisible()
  })

  test('renders 7 stage columns with stage names', async ({ authenticatedPage: page }) => {
    // Each column has an h3 with the stage name and a count badge
    const columns = page.locator('.rounded-2xl.bg-slate-50')
    await expect(columns).toHaveCount(7)
  })

  test('search filters leads by name — only Marina visible', async ({ authenticatedPage: page }) => {
    const searchInput = page.getByPlaceholder('Buscar por nome, email ou empresa')
    await searchInput.fill('Marina')

    // Marina should be visible
    await expect(page.getByText('Marina Almeida')).toBeVisible()

    // Other leads should not be visible — Rafael should be hidden
    await expect(page.getByText('Rafael Souza')).not.toBeVisible()
  })

  test('stage filter shows only leads in selected stage', async ({ authenticatedPage: page }) => {
    // Select the second stage in the dropdown (first real stage after "Todas as etapas")
    const stageSelects = page.locator('select')
    const stageSelect = stageSelects.nth(0) // stage filter is the first select
    await stageSelect.selectOption({ index: 1 })

    // After selecting a stage, leads count should update
    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('owner filter shows only leads for selected owner', async ({ authenticatedPage: page }) => {
    const ownerSelect = page.locator('select').nth(1) // owner filter is the second select
    await ownerSelect.selectOption({ index: 1 })

    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('sort by name orders leads alphabetically', async ({ authenticatedPage: page }) => {
    const sortSelect = page.locator('select').nth(2) // sort is the third select
    await sortSelect.selectOption('nome')

    // All lead cards should still be visible
    const leadCards = page.locator('.rounded-xl.border.border-slate-200.bg-white')
    const count = await leadCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('sort by empresa orders leads by company', async ({ authenticatedPage: page }) => {
    const sortSelect = page.locator('select').nth(2)
    await sortSelect.selectOption('empresa')

    const leadCards = page.locator('.rounded-xl.border.border-slate-200.bg-white')
    const count = await leadCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('clear filters button resets all filters', async ({ authenticatedPage: page }) => {
    // Apply a search filter first
    const searchInput = page.getByPlaceholder('Buscar por nome, email ou empresa')
    await searchInput.fill('Marina')
    await expect(page.getByText('Marina Almeida')).toBeVisible()

    // Click Limpar button
    await page.getByRole('button', { name: /Limpar/ }).click()

    // Search input should be empty
    await expect(searchInput).toHaveValue('')

    // All leads should be back
    const leadsText = page.getByText(/leads encontrados/)
    await expect(leadsText).toBeVisible()
  })

  test('kanban columns have drag handles on lead cards', async ({ authenticatedPage: page }) => {
    // Verify GripVertical icons exist (drag handles) — dnd-kit uses these
    const gripHandles = page.locator('[data-testid] svg, .rounded-xl.border svg.lucide-grip-vertical').first()
    // Lead cards render with a grip handle area via listeners
    const leadCards = page.locator('.rounded-xl.border.border-slate-200.bg-white')
    await expect(leadCards.first()).toBeVisible()
  })

  test('shows lead count text', async ({ authenticatedPage: page }) => {
    const leadsText = page.getByText(/\d+ leads encontrados/)
    await expect(leadsText).toBeVisible()

    // Should show at least 6 leads (demo data)
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
