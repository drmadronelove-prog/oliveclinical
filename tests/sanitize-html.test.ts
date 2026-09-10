import { describe, it, expect } from 'vitest'
import { sanitizeTaskDescription } from '@/lib/team/sanitize-html'

describe('sanitizeTaskDescription', () => {
  it('keeps the formatting the toolbar actually offers', () => {
    const input = '<p>Call the <strong>landlord</strong> about the <em>lease</em>.</p><ul><li>One</li><li>Two</li></ul><ol><li>First</li></ol>'
    expect(sanitizeTaskDescription(input)).toBe(input)
  })

  it('strips a script tag entirely, not just its content', () => {
    const out = sanitizeTaskDescription('<p>hi</p><script>alert(1)</script>')
    expect(out).not.toContain('<script')
    expect(out).not.toContain('alert')
  })

  it('strips an inline event handler attribute', () => {
    const out = sanitizeTaskDescription('<p onmouseover="alert(1)">hover me</p>')
    expect(out).not.toContain('onmouseover')
    expect(out).not.toContain('alert')
  })

  it('refuses a javascript: link', () => {
    const out = sanitizeTaskDescription('<p><a href="javascript:alert(1)">click</a></p>')
    expect(out).not.toContain('javascript:')
  })

  it('drops tags outside the toolbar entirely, keeping their text', () => {
    const out = sanitizeTaskDescription('<h1>Big heading</h1><img src="x.png">')
    expect(out).not.toContain('<h1')
    expect(out).not.toContain('<img')
    expect(out).toContain('Big heading')
  })

  it('drops style and class attributes even on allowed tags', () => {
    const out = sanitizeTaskDescription('<p style="color:red" class="whatever">text</p>')
    expect(out).not.toContain('style=')
    expect(out).not.toContain('class=')
  })

  it('forces every surviving link to open safely', () => {
    const out = sanitizeTaskDescription('<p><a href="https://example.com">site</a></p>')
    expect(out).toContain('target="_blank"')
    expect(out).toContain('rel="noopener noreferrer"')
  })

  it('leaves plain text with no markup untouched', () => {
    expect(sanitizeTaskDescription('<p>just some notes</p>')).toBe('<p>just some notes</p>')
  })
})
