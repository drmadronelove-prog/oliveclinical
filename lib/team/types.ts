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

// ---------------------------------------------------------------------
// Phase 3 — onboarding templates
// ---------------------------------------------------------------------

export type ProjectTemplate = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type TemplateSection = {
  id: string
  template_id: string
  name: string
  position: number
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type TemplateTask = {
  id: string
  template_id: string
  template_section_id: string
  title: string
  offset_days: number
  default_assignee_role: string | null
  position: number
  created_at: string
  updated_at: string
  archived_at: string | null
}

/** "-14" -> "14 days before start" · "0" -> "Start day" · "30" -> "30 days after start" */
export function formatOffsetDays(offsetDays: number): string {
  if (offsetDays === 0) return 'Start day'
  if (offsetDays < 0) return `${Math.abs(offsetDays)} day${offsetDays === -1 ? '' : 's'} before start`
  return `${offsetDays} day${offsetDays === 1 ? '' : 's'} after start`
}

/**
 * The real calendar date a template task lands on once an anchor (start)
 * date is chosen. Built from date parts rather than millisecond math, so
 * it can never drift across a daylight-saving change.
 */
export function addOffsetDays(anchorDateIso: string, offsetDays: number): string {
  const [year, month, day] = anchorDateIso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + offsetDays)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ---------------------------------------------------------------------
// Phase 4 — tags, and the My Tasks date buckets
// ---------------------------------------------------------------------

export type Tag = {
  id: string
  name: string
  color: string
  created_at: string
  archived_at: string | null
}

export type TaskBucket = 'overdue' | 'today' | 'this_week' | 'later'

export const TASK_BUCKET_LABEL: Record<TaskBucket, string> = {
  overdue: 'Overdue',
  today: 'Today',
  this_week: 'This week',
  later: 'Later',
}

export const TASK_BUCKET_ORDER: TaskBucket[] = ['overdue', 'today', 'this_week', 'later']

/**
 * Which of the four My Tasks groups a task falls into. A completed task
 * is never bucketed by the caller — it has nothing left to plan around —
 * so this only looks at the date.
 *
 * "This week" means through the coming Sunday. A task with no due date
 * at all goes to Later — there's no fifth "someday" bucket in the
 * design, and Later already means "not urgent."
 */
export function bucketTaskDate(dueDate: string | null, referenceDate: Date = new Date()): TaskBucket {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())

  if (!dueDate) return 'later'

  const [year, month, day] = dueDate.split('-').map(Number)
  const due = new Date(year, month - 1, day)

  if (due < today) return 'overdue'
  if (due.getTime() === today.getTime()) return 'today'

  const daysUntilSunday = 7 - today.getDay() // getDay(): 0 = Sunday
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday))

  return due <= endOfWeek ? 'this_week' : 'later'
}
