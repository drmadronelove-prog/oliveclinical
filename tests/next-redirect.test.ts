import { describe, it, expect } from 'vitest'
import { isNextRedirectError } from '@/lib/team/next-redirect'

describe('isNextRedirectError', () => {
  it('recognizes a Next.js redirect error by its digest prefix', () => {
    expect(isNextRedirectError({ digest: 'NEXT_REDIRECT;push;/team/login;307;' })).toBe(true)
  })

  it('rejects a plain Error with no digest', () => {
    expect(isNextRedirectError(new Error('boom'))).toBe(false)
  })

  it('rejects an object with an unrelated digest', () => {
    expect(isNextRedirectError({ digest: 'SOME_OTHER_DIGEST' })).toBe(false)
  })

  it('rejects null and non-objects', () => {
    expect(isNextRedirectError(null)).toBe(false)
    expect(isNextRedirectError('a string')).toBe(false)
    expect(isNextRedirectError(undefined)).toBe(false)
  })
})
