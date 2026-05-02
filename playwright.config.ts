import { defineConfig, devices } from '@playwright/test'

const hasUiAuditCreds = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD)

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: hasUiAuditCreds ? [] : ['**/ui-audit.spec.ts'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3010',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'USE_DEMO_MODE=true pnpm dev',
    url: process.env.BASE_URL ? `${process.env.BASE_URL}/login` : 'http://127.0.0.1:3010/login',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      USE_DEMO_MODE: 'true',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
