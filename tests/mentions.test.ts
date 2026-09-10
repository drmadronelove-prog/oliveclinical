import { describe, it, expect } from 'vitest'
import { parseMentions } from '@/lib/team/mentions'
import type { Profile } from '@/lib/team/types'

const madrone: Profile = {
  id: 'p1',
  email: 'madrone@example.com',
  name: 'Madrone Love',
  avatar_url: null,
  role: 'admin',
  created_at: '',
  updated_at: '',
  archived_at: null,
}
const jordan: Profile = { ...madrone, id: 'p2', name: 'Jordan Rivera', email: 'jordan@example.com' }
const noName: Profile = { ...madrone, id: 'p3', name: null, email: 'sam@example.com' }

describe('parseMentions', () => {
  it('finds a mention of a two-word name', () => {
    expect(parseMentions('Hey @Jordan Rivera can you check this', [madrone, jordan])).toEqual(['p2'])
  })

  it('is case-insensitive', () => {
    expect(parseMentions('hey @jordan rivera', [madrone, jordan])).toEqual(['p2'])
  })

  it('finds more than one mention', () => {
    const result = parseMentions('@Madrone Love and @Jordan Rivera please look', [madrone, jordan])
    expect(result.sort()).toEqual(['p1', 'p2'])
  })

  it('does not match a name with no @ in front of it', () => {
    expect(parseMentions('Jordan Rivera mentioned this earlier', [madrone, jordan])).toEqual([])
  })

  it('does not match a partial name', () => {
    expect(parseMentions('@Jordan is not enough on its own', [madrone, jordan])).toEqual([])
  })

  it('falls back to matching the email for someone with no name set', () => {
    expect(parseMentions('loop in @sam@example.com', [noName])).toEqual(['p3'])
  })

  it('returns nothing for a comment with no mentions', () => {
    expect(parseMentions('Just a note, no one tagged', [madrone, jordan])).toEqual([])
  })
})
