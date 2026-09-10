import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end coverage for the critical task flows: create a task, assign
 * it, complete it. Needs a real Supabase project and a real signed-in
 * test account — see PHASE-2.md for the two-line setup. Without those,
 * every test in here skips itself rather than failing, the same pattern
 * the Vitest row-level-security tests use.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // This environment ships Chromium at a fixed path rather than
        // one Playwright downloads itself; harmless to point at
        // elsewhere too as long as the binary exists.
        launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
