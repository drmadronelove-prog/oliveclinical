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

// ---------------------------------------------------------------------
// Phase 2 — projects, sections, tasks
// ---------------------------------------------------------------------

export type ProjectType = 'marketing' | 'onboarding' | 'assessment' | 'general'
export type ProjectStatus = 'on_track' | 'at_risk' | 'blocked' | 'done'
export type ProjectView = 'list' | 'board' | 'calendar'

export type Project = {
  id: string
  name: string
  description: string | null
  color: string
  type: ProjectType
  status: ProjectStatus
  owner_id: string | null
  due_date: string | null
  default_view: ProjectView
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type Section = {
  id: string
  project_id: string
  name: string
  position: number
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type Task = {
  id: string
  project_id: string
  section_id: string
  parent_task_id: string | null
  title: string
  description: string | null
  assignee_id: string | null
  due_date: string | null
  start_date: string | null
  priority: import('./priority').Priority
  completed: boolean
  completed_at: string | null
  position: number
  created_at: string
  updated_at: string
  archived_at: string | null
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  on_track: 'On track',
  at_risk: 'At risk',
  blocked: 'Blocked',
  done: 'Done',
}

export const PROJECT_STATUS_DOT_CLASS: Record<ProjectStatus, string> = {
  on_track: 'bg-[var(--glass)]',
  at_risk: 'bg-[var(--gold)]',
  blocked: 'bg-destructive',
  done: 'bg-[var(--slate)]',
}

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  marketing: 'Marketing',
  onboarding: 'Onboarding',
  assessment: 'Assessment',
  general: 'General',
}

/** A short, readable date for task rows — "Mar 14", never a full ISO string. */
export function formatShortDate(iso: string | null): string | null {
  if (!iso) return null
  const [year, month, day] = iso.split('-').map(Number)
  // Built from the parts, not `new Date(iso)`, so a date-only value never
  // shifts a day when the browser's timezone is behind UTC.
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** True when a due date has passed and the task is still open. */
export function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = dueDate.split('-').map(Number)
  return new Date(year, month - 1, day) < today
}
