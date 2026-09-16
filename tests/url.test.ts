import { describe, it, expect } from 'vitest'
import { normalizeUrl } from '@/lib/team/url'

describe('normalizeUrl', () => {
  it('leaves a URL with a scheme alone', () => {
    expect(normalizeUrl('https://drive.google.com/drive/folders/abc')).toBe(
      'https://drive.google.com/drive/folders/abc',
    )
  })

  it('adds https:// to a bare domain', () => {
    expect(normalizeUrl('drive.google.com/drive/folders/abc')).toBe(
      'https://drive.google.com/drive/folders/abc',
    )
  })

  it('accepts an existing http:// scheme without forcing https', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com/')
  })

  it('returns null for an empty string', () => {
    expect(normalizeUrl('')).toBeNull()
    expect(normalizeUrl('   ')).toBeNull()
  })

  it('returns null for something that still is not a URL once a scheme is assumed', () => {
    expect(normalizeUrl('not a url at all')).toBeNull()
  })
})
