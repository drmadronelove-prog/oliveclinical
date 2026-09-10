import { test as base, expect } from '@playwright/test'

/**
 * These tests sign in for real, so they need a real account. Rather than
 * invent one, they use credentials you provide — see PHASE-2.md. Every
 * test using this fixture skips itself when they are absent, the same
 * way the Vitest row-level-security tests skip without a Supabase
 * project.
 */
export const TEST_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL
export const TEST_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD

export const test = base.extend({})

export function requireTestAccount() {
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    'Set PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD to run this against a real account — see PHASE-2.md.',
  )
}

export { expect }
