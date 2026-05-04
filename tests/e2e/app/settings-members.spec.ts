import { test, expect } from '../fixtures/auth'

test.describe('Configurações — Membros', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/settings/members')
  })

  test('heading da página de membros é visível', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: /membros/i }).first()).toBeVisible()
  })

  test('formulário de convite renderiza campo de email e select de papel', async ({ authenticatedPage: page }) => {
    await expect(page.getByPlaceholder(/e-mail do novo membro/i)).toBeVisible()
    const roleSelect = page.locator('select')
    await expect(roleSelect).toBeVisible()
    await expect(roleSelect.locator('option', { hasText: /membro/i })).toHaveCount(1)
    await expect(roleSelect.locator('option', { hasText: /administrador/i })).toHaveCount(1)
  })

  test('botão Convidar está presente', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('button', { name: /convidar/i })).toBeVisible()
  })

  test('seção de lista de membros é renderizada', async ({ authenticatedPage: page }) => {
    await expect(page.getByText(/membros do workspace|equipe|nenhum membro/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('campo de email aceita entrada', async ({ authenticatedPage: page }) => {
    const emailInput = page.getByPlaceholder(/e-mail do novo membro/i)
    await emailInput.fill('novo@teste.com')
    await expect(emailInput).toHaveValue('novo@teste.com')
  })
})
