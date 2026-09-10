import { describe, it, expect } from 'vitest'
import { describeActivity } from '@/lib/team/activity-copy'
import type { ActivityLogEntry, Profile, Section } from '@/lib/team/types'

const jordan: Profile = {
  id: 'm1',
  email: 'jordan@example.com',
  name: 'Jordan Rivera',
  avatar_url: null,
  role: 'member',
  created_at: '',
  updated_at: '',
  archived_at: null,
}
const madrone: Profile = { ...jordan, id: 'm2', name: 'Madrone Love', email: 'madrone@example.com' }
const membersById = new Map([[jordan.id, jordan], [madrone.id, madrone]])

const inProgress: Section = {
  id: 'sec1',
  project_id: 'p1',
  name: 'In progress',
  position: 1,
  created_at: '',
  updated_at: '',
  archived_at: null,
}
const sectionsById = new Map([[inProgress.id, inProgress]])

function entry(overrides: Partial<ActivityLogEntry>): ActivityLogEntry {
  return {
    id: 'a1',
    task_id: 't1',
    actor_id: jordan.id,
    field: 'completed',
    old_value: null,
    new_value: null,
    created_at: '',
    ...overrides,
  }
}

describe('describeActivity', () => {
  it('describes completing a task', () => {
    expect(describeActivity(entry({ field: 'completed', new_value: 'true' }), { membersById, sectionsById })).toBe(
      'Jordan Rivera marked this complete',
    )
  })

  it('describes reopening a task', () => {
    expect(describeActivity(entry({ field: 'completed', new_value: 'false' }), { membersById, sectionsById })).toBe(
      'Jordan Rivera reopened this task',
    )
  })

  it('describes a reassignment, from and to', () => {
    expect(
      describeActivity(entry({ field: 'assignee', old_value: null, new_value: madrone.id }), { membersById, sectionsById }),
    ).toBe('Jordan Rivera reassigned this from Unassigned to Madrone Love')
  })

  it('describes a due date change', () => {
    expect(describeActivity(entry({ field: 'due_date', new_value: '2026-03-14' }), { membersById, sectionsById })).toBe(
      'Jordan Rivera set the due date to Mar 14',
    )
  })

  it('describes a section move', () => {
    expect(describeActivity(entry({ field: 'section', new_value: inProgress.id }), { membersById, sectionsById })).toBe(
      'Jordan Rivera moved this to In progress',
    )
  })

  it('falls back to "Someone" when the actor is missing', () => {
    expect(describeActivity(entry({ actor_id: null, field: 'completed', new_value: 'true' }), { membersById, sectionsById })).toBe(
      'Someone marked this complete',
    )
  })

  it('appends the task title when given one, for the project-wide feed', () => {
    expect(
      describeActivity(entry({ field: 'completed', new_value: 'true' }), {
        membersById,
        sectionsById,
        taskTitle: 'Renew the fall newsletter',
      }),
    ).toBe('Jordan Rivera marked this complete — Renew the fall newsletter')
  })
})
