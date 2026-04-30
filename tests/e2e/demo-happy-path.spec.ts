import { expect, test } from '@playwright/test'

// Depende do modo demo/offline para usar os dados mockados do app.
test('fluxo feliz demo offline', async ({ page }) => {
  const leadName = `Lead E2E ${Date.now()}`

  await page.goto('/login')
  await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
  await page.getByLabel('Senha').fill('demo123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()

  await page.goto('/kanban')
  await expect(page.getByRole('heading', { name: /funil de leads/i })).toBeVisible()
  await page.getByPlaceholder('Buscar por nome, email ou empresa').fill('Marina')
  await expect(page.getByText('Marina Almeida')).toBeVisible()

  await page.goto('/leads/new')
  await expect(page.getByRole('heading', { name: /novo lead/i })).toBeVisible()
  await page.getByPlaceholder('Nome').fill(leadName)
  await page.locator('select').first().selectOption({ index: 1 })
  await page.getByPlaceholder('Email').fill(`e2e-${Date.now()}@example.com`)
  await page.getByPlaceholder('Empresa').fill('Empresa E2E')
  await page.getByPlaceholder('Cargo').fill('SDR')
  await page.getByPlaceholder('Origem').fill('Teste')
  await page.getByPlaceholder('Observações').fill('Lead criado pelo teste E2E.')
  await page.getByRole('button', { name: 'Salvar' }).click()

  await expect(page).toHaveURL(/\/kanban/)
  await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(leadName)
  await expect(page.getByText(leadName)).toBeVisible()

  await page.goto('/campaigns')
  await expect(page.getByRole('heading', { name: /campanhas/i })).toBeVisible()
  await expect(page.getByText('Campanha Outbound Q2')).toBeVisible()
})
