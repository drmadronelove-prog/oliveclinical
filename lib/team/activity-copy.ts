import { displayName, formatShortDate, type ActivityLogEntry, type Profile, type Section } from './types'
import { PRIORITY_LABEL, type Priority } from './priority'

/**
 * The one sentence for a single activity-log row — "Jordan reassigned
 * this from Unassigned to Madrone Love." Shared between the per-task
 * Activity section (where "this" is unambiguous — it's the task the
 * pane is already open to) and the project-wide Overview feed (where it
 * isn't, so `taskTitle` gets appended: "... — Renew the fall
 * newsletter"), so the two never describe the same row differently.
 */
export function describeActivity(
  entry: ActivityLogEntry,
  {
    membersById,
    sectionsById,
    taskTitle,
  }: { membersById: Map<string, Profile>; sectionsById: Map<string, Section>; taskTitle?: string },
): string {
  const who = entry.actor_id ? displayName(membersById.get(entry.actor_id) ?? { name: null, email: 'Someone' }) : 'Someone'

  const sentence = (() => {
    switch (entry.field) {
      case 'completed':
        return entry.new_value === 'true' ? `${who} marked this complete` : `${who} reopened this task`
      case 'assignee': {
        const from = entry.old_value ? displayName(membersById.get(entry.old_value) ?? { name: null, email: 'someone' }) : 'Unassigned'
        const to = entry.new_value ? displayName(membersById.get(entry.new_value) ?? { name: null, email: 'someone' }) : 'Unassigned'
        return `${who} reassigned this from ${from} to ${to}`
      }
      case 'due_date': {
        const to = entry.new_value ? formatShortDate(entry.new_value) : 'no date'
        return `${who} set the due date to ${to}`
      }
      case 'priority': {
        const to = PRIORITY_LABEL[(entry.new_value as Priority) ?? 'none']
        return `${who} set priority to ${to}`
      }
      case 'section': {
        const to = entry.new_value ? (sectionsById.get(entry.new_value)?.name ?? 'another section') : 'another section'
        return `${who} moved this to ${to}`
      }
      case 'title':
        return `${who} renamed this task`
      default:
        return `${who} made a change`
    }
  })()

  return taskTitle ? `${sentence} — ${taskTitle}` : sentence
}
