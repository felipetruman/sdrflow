import { test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const baseURL = 'http://127.0.0.1:3000'
const outDir = '/home/freedom/freedomdigitalhub/workspace/products/sdrflow/images'
const logFile = path.join(outDir, 'ui-audit.log')
const email = process.env.E2E_EMAIL
const password = process.env.E2E_PASSWORD
if (!email || !password) {
  throw new Error('E2E_EMAIL and E2E_PASSWORD environment variables are required')
}

function append(line: string) {
  fs.appendFileSync(logFile, line + '\n')
}

async function capture(page: Page, name: string) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true })
}

test('audit UI pages and collect logs', async ({ page }) => {
  fs.writeFileSync(logFile, `UI audit started ${new Date().toISOString()}\n`)

  page.on('console', msg => append(`[console:${msg.type()}] ${msg.text()}`))
  page.on('pageerror', err => append(`[pageerror] ${err.message}`))
  page.on('requestfailed', req => append(`[requestfailed] ${req.method()} ${req.url()} :: ${req.failure()?.errorText}`))
  page.on('response', async res => {
    if (res.status() >= 400) append(`[response:${res.status()}] ${res.request().method()} ${res.url()}`)
  })

  await page.goto(`${baseURL}/login`, { waitUntil: 'networkidle' })
  await capture(page, '01-login')

  const inputs = page.locator('input')
  await inputs.nth(0).fill(email)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForLoadState('networkidle')
  await capture(page, '02-post-login')

  const workspaceInput = page.getByPlaceholder('Nome do workspace')
  if (await workspaceInput.count()) {
    await workspaceInput.fill('Workspace QA Playwright')
    await page.getByRole('button', { name: 'Criar workspace' }).click()
    await page.waitForLoadState('networkidle')
    await capture(page, '03-workspace-onboarding')
  }

  const pages = [
    ['dashboard', `${baseURL}/dashboard`],
    ['kanban', `${baseURL}/kanban`],
    ['campaigns', `${baseURL}/campaigns`],
    ['settings-fields', `${baseURL}/settings/fields`],
    ['settings-funnel', `${baseURL}/settings/funnel`],
    ['leads-new', `${baseURL}/leads/new`],
  ] as const

  for (const [name, url] of pages) {
    await page.goto(url, { waitUntil: 'networkidle' })
    await capture(page, `page-${name}`)
  }

  await page.goto(`${baseURL}/kanban`, { waitUntil: 'networkidle' })
  const leadLinks = page.locator('a[href*="/leads/"]')
  if (await leadLinks.count()) {
    const href = await leadLinks.first().getAttribute('href')
    if (href) {
      await page.goto(`${baseURL}${href}`, { waitUntil: 'networkidle' })
      await capture(page, 'page-lead-detail')
    }
  }

  append(`UI audit finished ${new Date().toISOString()}`)
})
