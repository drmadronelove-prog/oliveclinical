import { formatShortDate, type Profile, type Section, type Tag, type Task } from './types'
import { PRIORITY_LABEL, type Priority } from './priority'

/**
 * One CSV cell. A leading apostrophe is prepended when the value starts
 * with =, +, -, or @ — Excel/Sheets/Numbers all treat a cell starting
 * with one of those as a formula to evaluate, and a task title is
 * ordinary user text, never something that should execute when someone
 * opens the export. The apostrophe forces it to stay literal text.
 * Quoted only when it needs to be after that — a comma, a quote, or a
 * newline in the value; quoting everything would still be correct, just
 * noisier to read if someone opens the file in a plain text editor.
 */
export function toCsvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
  if (/[",\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`
  return safe
}

/** Rows of plain strings to one CSV document, CRLF line endings (the RFC 4180 default). */
export function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map(toCsvCell).join(',')).join('\r\n')
}

const CSV_HEADER = ['Title', 'Section', 'Assignee', 'Due date', 'Priority', 'Status', 'Tags']

/**
 * A project's active tasks as a CSV, one row per task — internal
 * planning fields only (title, section, assignee, due date, priority,
 * complete/open, tags). Nothing here is or could become clinical
 * content; this exists to hand a status snapshot to someone who wants a
 * spreadsheet, not to report on anything client-related.
 */
export function projectTasksToCsv(
  tasks: Task[],
  sections: Section[],
  members: Profile[],
  taskTags: Record<string, Tag[]>,
): string {
  const sectionsById = new Map(sections.map((s) => [s.id, s]))
  const membersById = new Map(members.map((m) => [m.id, m]))

  const rows = tasks.map((task) => [
    task.title,
    sectionsById.get(task.section_id)?.name ?? '',
    task.assignee_id ? (membersById.get(task.assignee_id)?.name ?? membersById.get(task.assignee_id)?.email ?? '') : '',
    formatShortDate(task.due_date) ?? '',
    PRIORITY_LABEL[task.priority as Priority] ?? '',
    task.completed ? 'Complete' : 'Open',
    (taskTags[task.id] ?? []).map((t) => t.name).join('; '),
  ])

  return toCsv([CSV_HEADER, ...rows])
}
