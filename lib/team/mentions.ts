import { displayName, type Profile } from './types'

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Which team members are @mentioned in a comment. Matched against each
 * member's exact display name (case-insensitive), because the comment
 * composer only ever inserts "@Full Name" via a click-to-mention chip —
 * this isn't trying to parse someone's free-typed, possibly misspelled
 * guess at a name.
 */
export function parseMentions(body: string, members: Profile[]): string[] {
  const mentioned = new Set<string>()
  for (const member of members) {
    const pattern = new RegExp(`@${escapeRegExp(displayName(member))}\\b`, 'i')
    if (pattern.test(body)) mentioned.add(member.id)
  }
  return [...mentioned]
}
