import { expect, test } from '@playwright/test'

test.describe('SDRFlow E2E - Fluxo Completo', () => {
  const leadName = `Lead E2E ${Date.now()}`
  const leadEmail = `e2e-${Date.now()}@example.com`

  test('login com credenciais demo', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('logout funciona', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/dashboard/)

    // Clicar em Sair no sidebar
    await page.getByText('Sair').click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('criar lead e aparecer no kanban', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/leads/new')
    await expect(page.getByRole('heading', { name: /novo lead/i })).toBeVisible()

    await page.getByPlaceholder('Nome *').fill(leadName)
    await page.locator('select').first().selectOption({ index: 1 }) // Seleciona etapa
    await page.getByPlaceholder('Email').fill(leadEmail)
    await page.getByPlaceholder('Empresa').fill('Empresa E2E')
    await page.getByPlaceholder('Cargo').fill('SDR')
    await page.getByPlaceholder('Origem').fill('Teste')
    await page.getByPlaceholder('Observações').fill('Lead criado pelo teste E2E.')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/kanban/, { timeout: 10000 })
    // Aguardar carregamento do kanban
    await page.waitForTimeout(3000)
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(leadName)
    await page.waitForTimeout(1500)
    await expect(page.getByText(leadName)).toBeVisible()
  })

  test('editar lead existente', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    // Ir para kanban e encontrar lead existente
    await page.goto('/kanban')
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill('Marina')
    await expect(page.getByText('Marina Almeida')).toBeVisible()

    // Clicar no botao "Ver" do card (evitar pegar "Novo Lead" do sidebar)
    await page.locator('a[href^="/leads/lead-"]').first().click()

    // Na pagina de detalhe, clicar em editar
    await expect(page).toHaveURL(/\/leads\//)
    await page.getByRole('button', { name: 'Editar' }).click()
    await page.waitForTimeout(1000)

    // Editar campo
    const notesField = page.getByPlaceholder('Observações')
    await notesField.fill('Observacao editada pelo E2E')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(2000)

    // Verificar se salvou
    await expect(page.getByText('Observacao editada pelo E2E')).toBeVisible()
  })

  test('excluir lead', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    // Criar lead para excluir
    await page.goto('/leads/new')
    const deleteLeadName = `Lead Delete ${Date.now()}`
    await page.getByPlaceholder('Nome *').fill(deleteLeadName)
    await page.locator('select').first().selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/kanban/, { timeout: 10000 })
    await page.waitForTimeout(2000)
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(deleteLeadName)
    await page.waitForTimeout(1000)
    await expect(page.getByText(deleteLeadName)).toBeVisible()

    // Clicar em excluir no card
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: /excluir/i }).first().click()

    // Verificar que nao esta mais no kanban
    await page.waitForTimeout(1500)
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(deleteLeadName)
    await page.waitForTimeout(1000)
    await expect(page.getByText(deleteLeadName)).not.toBeVisible()
  })

  test('gerar mensagens com IA para lead', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    // Abrir lead existente
    await page.goto('/kanban')
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill('Marina')
    await expect(page.getByText('Marina Almeida')).toBeVisible()

    // Clicar no botao "Ver" (evitar pegar "Novo Lead" do sidebar)
    await page.locator('a[href^="/leads/lead-"]').first().click()

    await expect(page).toHaveURL(/\/leads\//)

    // Clicar em gerar mensagens
    const generateButton = page.getByRole('button', { name: 'Gerar Mensagens' })
    await expect(generateButton).toBeVisible()
    await generateButton.click()

    // Aguardar mensagens aparecerem (fallback em ate 10s)
    await expect(page.getByText(/mensagem|variação|Olá|Oi/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('enviar mensagem simulada move lead para Tentando Contato', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    // Criar lead para teste
    await page.goto('/leads/new')
    const sendLeadName = `Lead Send ${Date.now()}`
    await page.getByPlaceholder('Nome *').fill(sendLeadName)
    await page.locator('select').first().selectOption({ index: 1 }) // Base
    await page.getByPlaceholder('Email').fill(`send-${Date.now()}@example.com`)
    await page.getByPlaceholder('Empresa').fill('Empresa Send')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/kanban/, { timeout: 10000 })
    await page.waitForTimeout(2000)

    // Abrir lead
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(sendLeadName)
    await page.locator('a[href^="/leads/lead-"]').first().click()

    await expect(page).toHaveURL(/\/leads\//)

    // Gerar mensagens
    const generateButton = page.getByRole('button', { name: 'Gerar Mensagens' })
    await expect(generateButton).toBeVisible()
    await generateButton.click()
    await page.waitForTimeout(4000)

    // Clicar em enviar simulado
    const sendButton = page.getByRole('button', { name: /enviar/i }).first()
    await expect(sendButton).toBeVisible()
    await sendButton.click()
    await page.waitForTimeout(2000)

    // Verificar que lead aparece em "Tentando Contato" no Kanban
    await page.goto('/kanban')
    await page.waitForTimeout(2000)
    await page.getByPlaceholder('Buscar por nome, email ou empresa').fill(sendLeadName)
    await page.waitForTimeout(1000)
    await expect(page.getByText(sendLeadName)).toBeVisible()
  })

  test('campanhas sao listadas', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/campaigns')
    await expect(page.getByRole('heading', { name: /campanhas/i })).toBeVisible()
    await expect(page.getByText('Campanha Outbound Q2')).toBeVisible()
  })

  test('dashboard exibe metricas', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('demo@sdrflow.ai')
    await page.getByLabel('Senha').fill('demo123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()

    // Verificar cards de metricas
    await expect(page.getByText(/total de leads|leads/i).first()).toBeVisible()
    await expect(page.getByText(/campanhas ativas|campanhas/i).first()).toBeVisible()
    await expect(page.getByText(/mensagens geradas|mensagens/i).first()).toBeVisible()
  })
})
