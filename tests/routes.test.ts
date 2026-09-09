import { describe, it, expect } from 'vitest'
import { isPublicTeamRoute, safeNext } from '@/lib/team/routes'
import { initialsOf, displayName } from '@/lib/team/types'

describe('isPublicTeamRoute', () => {
  it('lets signed-out people reach the sign-in pages', () => {
    expect(isPublicTeamRoute('/team/login')).toBe(true)
    expect(isPublicTeamRoute('/team/reset-password')).toBe(true)
    expect(isPublicTeamRoute('/team/update-password')).toBe(true)
    expect(isPublicTeamRoute('/team/auth/callback')).toBe(true)
  })

  it('guards everything else in the workspace', () => {
    expect(isPublicTeamRoute('/team')).toBe(false)
    expect(isPublicTeamRoute('/team/members')).toBe(false)
    expect(isPublicTeamRoute('/team/settings')).toBe(false)
    expect(isPublicTeamRoute('/team/projects/anything')).toBe(false)
  })

  it('is not fooled by a path that merely starts with a public one', () => {
    // /team/loginsomething must NOT be treated as the login page.
    expect(isPublicTeamRoute('/team/loginsomething')).toBe(false)
    expect(isPublicTeamRoute('/team/members/login')).toBe(false)
  })
})

describe('safeNext', () => {
  it('keeps in-workspace destinations', () => {
    expect(safeNext('/team/members')).toBe('/team/members')
    expect(safeNext('/team')).toBe('/team')
  })

  it('refuses to redirect off-site after sign-in', () => {
    expect(safeNext('https://evil.example')).toBe('/team')
    expect(safeNext('//evil.example')).toBe('/team')
    expect(safeNext('/\\evil.example')).toBe('/team')
    expect(safeNext('/blog')).toBe('/team')
    expect(safeNext(null)).toBe('/team')
    expect(safeNext(undefined)).toBe('/team')
  })
})

describe('name helpers', () => {
  it('builds initials from a full name', () => {
    expect(initialsOf({ name: 'Madrone Love', email: 'm@x.com' })).toBe('ML')
    expect(initialsOf({ name: 'Prince', email: 'm@x.com' })).toBe('PR')
  })

  it('falls back to the email before someone has set a name', () => {
    expect(initialsOf({ name: null, email: 'jordan.rivera@example.com' })).toBe('JR')
    expect(initialsOf({ name: null, email: 'madrone@example.com' })).toBe('MA')
    expect(displayName({ name: null, email: 'j@x.com' })).toBe('j@x.com')
    expect(displayName({ name: '  ', email: 'j@x.com' })).toBe('j@x.com')
  })
})
