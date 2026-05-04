import { test, expect } from '../fixtures/auth'
import { DEMO_LEADS, DEMO_STAGES } from '../helpers/demo-data'

test.describe('Leads — criação e visualização', () => {
  test('formulário novo lead renderiza todos os campos', async ({ authenticatedPage: page }) => {
    await page.goto('/leads/new')
    await expect(page.getByRole('heading', { name: 'Novo Lead' })).toBeVisible()
    await expect(page.getByPlaceholder('Nome *')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Empresa')).toBeVisible()
    await expect(page.getByPlaceholder('Cargo')).toBeVisible()
    await expect(page.getByPlaceholder('Telefone')).toBeVisible()
    await expect(page.getByPlaceholder('Origem')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible()
  })

  test('seletor de etapas contém as etapas demo', async ({ authenticatedPage: page }) => {
    await page.goto('/leads/new')
    const select = page.locator('select').first()
    for (const stage of DEMO_STAGES) {
      await expect(select.locator(`option[value="${stage.id}"]`)).toHaveText(stage.name)
    }
  })

  test('cria lead válido e redireciona para /kanban', async ({ authenticatedPage: page }) => {
    await page.goto('/leads/new')
    await page.getByPlaceholder('Nome *').fill('Teste E2E Lead')
    await page.getByPlaceholder('Empresa').fill('Empresa Teste')
    await page.locator('select').first().selectOption({ label: 'Base' })
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForURL(/\/kanban/)
    await expect(page).toHaveURL(/\/kanban/)
  })

  test('lead criado aparece na busca do kanban', async ({ authenticatedPage: page }) => {
    const uniqueName = `Lead E2E ${Date.now()}`
    await page.goto('/leads/new')
    await page.getByPlaceholder('Nome *').fill(uniqueName)
    await page.locator('select').first().selectOption({ label: 'Base' })
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForURL(/\/kanban/)
    await page.getByPlaceholder(/buscar|pesquisar|search/i).fill(uniqueName.split(' ').pop()!)
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 5000 })
  })

  test('leads demo aparecem no kanban', async ({ authenticatedPage: page }) => {
    await page.goto('/kanban')
    for (const lead of DEMO_LEADS) {
      await expect(page.getByText(lead.name)).toBeVisible()
    }
  })
})

test.describe('Lead — detalhe', () => {
  test('página de detalhe de lead demo renderiza seções principais', async ({ authenticatedPage: page }) => {
    await page.goto(`/leads/${DEMO_LEADS[0].id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(DEMO_LEADS[0].name)).toBeVisible()
    await expect(page.getByText(/gerar mensagens|generate/i)).toBeVisible()
    await expect(page.getByText(/histórico|mensagens|atividades/i).first()).toBeVisible()
  })

  test('botão Ver no card abre detalhe do lead correto', async ({ authenticatedPage: page }) => {
    await page.goto('/kanban')
    const verLink = page.getByRole('link', { name: /ver/i }).first()
    const href = await verLink.getAttribute('href')
    await verLink.click()
    await page.waitForURL(/\/leads\//, { timeout: 15000 })
    expect(page.url()).toContain('/leads/')
    if (href) expect(page.url()).toContain(href.replace('/leads/', ''))
  })
})
