import { describe, it, expect } from 'vitest'
import { toCsv, toCsvCell, projectTasksToCsv } from '@/lib/team/csv'
import type { Profile, Section, Tag, Task } from '@/lib/team/types'

describe('toCsvCell', () => {
  it('leaves a plain value alone', () => {
    expect(toCsvCell('Renew the newsletter')).toBe('Renew the newsletter')
  })

  it('quotes a value containing a comma', () => {
    expect(toCsvCell('Newsletter, fall edition')).toBe('"Newsletter, fall edition"')
  })

  it('quotes and escapes a value containing a quote', () => {
    expect(toCsvCell('Say "hi" to clients')).toBe('"Say ""hi"" to clients"')
  })

  it('quotes a value containing a newline', () => {
    expect(toCsvCell('Line one\nLine two')).toBe('"Line one\nLine two"')
  })
})

describe('toCsv', () => {
  it('joins cells with commas and rows with CRLF', () => {
    expect(toCsv([['a', 'b'], ['c', 'd']])).toBe('a,b\r\nc,d')
  })
})

const admin: Profile = {
  id: 'm1',
  email: 'admin@example.com',
  name: 'Madrone Love',
  avatar_url: null,
  role: 'admin',
  created_at: '',
  updated_at: '',
  archived_at: null,
}

const section: Section = {
  id: 's1',
  project_id: 'p1',
  name: 'In progress',
  position: 1,
  created_at: '',
  updated_at: '',
  archived_at: null,
}

function task(overrides: Partial<Task>): Task {
  return {
    id: 't1',
    project_id: 'p1',
    section_id: 's1',
    parent_task_id: null,
    title: 'Renew the fall newsletter',
    description: null,
    assignee_id: null,
    due_date: null,
    start_date: null,
    priority: 'none',
    completed: false,
    completed_at: null,
    position: 1,
    recurrence_rule: null,
    recurrence_parent_id: null,
    created_at: '',
    updated_at: '',
    archived_at: null,
    ...overrides,
  }
}

describe('projectTasksToCsv', () => {
  it('writes the header row and one row per task', () => {
    const csv = projectTasksToCsv(
      [task({ assignee_id: 'm1', due_date: '2026-03-14', priority: 'high', completed: true })],
      [section],
      [admin],
      {},
    )
    const [header, row] = csv.split('\r\n')
    expect(header).toBe('Title,Section,Assignee,Due date,Priority,Status,Tags')
    expect(row).toBe('Renew the fall newsletter,In progress,Madrone Love,Mar 14,High,Complete,')
  })

  it('quotes a title that contains a comma', () => {
    const csv = projectTasksToCsv([task({ title: 'Newsletter, fall edition' })], [section], [admin], {})
    expect(csv.split('\r\n')[1]).toContain('"Newsletter, fall edition"')
  })

  it('joins multiple tags with a semicolon', () => {
    const tags: Tag[] = [
      { id: 'g1', name: 'Urgent', color: '#000', created_at: '', archived_at: null },
      { id: 'g2', name: 'Q1', color: '#000', created_at: '', archived_at: null },
    ]
    const csv = projectTasksToCsv([task({})], [section], [admin], { t1: tags })
    expect(csv.split('\r\n')[1]).toContain('Urgent; Q1')
  })

  it('leaves assignee, due date, and tags blank when unset', () => {
    const csv = projectTasksToCsv([task({})], [section], [admin], {})
    expect(csv.split('\r\n')[1]).toBe('Renew the fall newsletter,In progress,,,No priority,Open,')
  })
})
