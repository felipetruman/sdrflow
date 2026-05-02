import { test, expect } from '../fixtures/auth'
import { DEMO_STAGES } from '../helpers/demo-data'

test.describe('Configurações — Funil', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/settings/funnel')
    // Wait for async stage load (useEffect → server action response)
    await expect(page.getByRole('button', { name: 'Editar etapa' }).first()).toBeVisible({ timeout: 15000 })
  })

  test('página de funil renderiza heading e etapas demo', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: /funil/i }).first()).toBeVisible()
    for (const stage of DEMO_STAGES) {
      await expect(page.getByText(stage.name).first()).toBeVisible()
    }
  })

  test('botão "Nova etapa" está visível', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('button', { name: /nova etapa/i })).toBeVisible()
  })

  test('cada etapa exibe botão de editar', async ({ authenticatedPage: page }) => {
    const editButtons = page.getByRole('button', { name: /editar etapa/i })
    await expect(editButtons.first()).toBeVisible()
    const count = await editButtons.count()
    expect(count).toBeGreaterThanOrEqual(DEMO_STAGES.length)
  })

  test('cada etapa exibe botão de remover', async ({ authenticatedPage: page }) => {
    const deleteButtons = page.getByRole('button', { name: /remover etapa/i })
    await expect(deleteButtons.first()).toBeVisible()
    const count = await deleteButtons.count()
    expect(count).toBeGreaterThanOrEqual(DEMO_STAGES.length)
  })

  test('clique em Nova etapa mostra campo de input', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: /nova etapa/i }).click()
    await expect(page.getByPlaceholder(/nome da etapa/i)).toBeVisible()
  })

  test('clique em editar mostra input inline', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: /editar etapa/i }).first().click()
    await expect(page.locator('input').first()).toBeVisible()
  })
})
