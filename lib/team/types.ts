export type MemberRole = 'admin' | 'member'

export type Profile = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: MemberRole
  created_at: string
  updated_at: string
  archived_at: string | null
}

/**
 * "Madrone Love" -> "ML". Before someone has set a name we fall back to
 * the local part of their email only — "jordan.rivera@example.com" is
 * "JR", never "JC" from pairing the first name with ".com".
 */
export function initialsOf(profile: Pick<Profile, 'name' | 'email'>): string {
  const named = profile.name?.trim()
  const source = named || profile.email.split('@')[0]
  const words = source.split(/[\s._-]+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function displayName(profile: Pick<Profile, 'name' | 'email'>): string {
  return profile.name?.trim() || profile.email
}
