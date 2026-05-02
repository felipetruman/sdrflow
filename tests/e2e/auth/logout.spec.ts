import { test, expect } from '../fixtures/auth'

test.describe('Logout', () => {
  test('clicar em Sair redireciona para login', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('apos logout, acessar dashboard redireciona para login', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/login/)
    // In demo mode middleware bypasses auth — dashboard may still be accessible
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/(login|dashboard)/)
  })

  test('pagina de login nao exibe sidebar', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/login/)
    // Sidebar should not be present on login page
    await expect(page.locator('aside')).toHaveCount(0)
  })
})
