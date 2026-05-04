import { expect, test } from '../fixtures/auth'

test.describe('Sidebar navigation', () => {

  test('navigates to Dashboard via sidebar', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('navigates to Kanban via sidebar', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Kanban' }).click()
    await expect(page).toHaveURL(/\/kanban/)
    await expect(page.getByRole('heading', { name: 'Funil de Leads' })).toBeVisible()
  })

  test('navigates to Novo Lead via sidebar', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Novo Lead' }).click()
    await expect(page).toHaveURL(/\/leads\/new/)
    await expect(page.getByRole('heading', { name: 'Novo Lead' })).toBeVisible()
  })

  test('navigates to Campanhas via sidebar', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Campanhas' }).click()
    await expect(page).toHaveURL(/\/campaigns/)
    await expect(page.getByRole('heading', { name: 'Campanhas' })).toBeVisible()
  })

  test('navigates to settings pages via sidebar', async ({ authenticatedPage: page }) => {
    // Funil
    await page.getByRole('link', { name: 'Funil' }).click()
    await expect(page).toHaveURL(/\/settings\/funnel/)
    await expect(page.getByRole('heading', { name: 'Configuração do Funil' })).toBeVisible()

    // Campos
    await page.getByRole('link', { name: 'Campos' }).click()
    await expect(page).toHaveURL(/\/settings\/fields/)
    await expect(page.getByRole('heading', { name: 'Campos Personalizados', exact: true })).toBeVisible()

    // Membros
    await page.getByRole('link', { name: 'Membros' }).click()
    await expect(page).toHaveURL(/\/settings\/members/)
    await expect(page.getByRole('heading', { name: 'Membros do Workspace', exact: true })).toBeVisible()
  })

  test('highlights active nav item via aria-current', async ({ authenticatedPage: page }) => {
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toHaveAttribute('aria-current', 'page')

    await page.getByRole('link', { name: 'Kanban' }).click()
    const kanbanLink = page.getByRole('link', { name: 'Kanban' })
    await expect(kanbanLink).toHaveAttribute('aria-current', 'page')

    const dashboardLinkAgain = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLinkAgain).not.toHaveAttribute('aria-current')
  })
})
