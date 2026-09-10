# Phase 4 — Views and marketing planning

**What this phase built:** a Board (kanban) view on every project, a
Calendar that shows every due task across every project on one month
view with drag-to-reschedule, and My Tasks — everything assigned to you,
grouped by when it's due. Plus tags, since Calendar needed them to filter
by.

Nothing about Phases 1–3 changed.

---

## Before you start: one more database step

1. Supabase → **SQL Editor → New query** → paste
   `supabase/migrations/0006_tags.sql` → **Run**.

That's it. Run against a real, disposable Postgres database before being
handed to you, along with all five earlier migrations in sequence, to
confirm the whole chain still applies cleanly from scratch.

---

## What to click to see it

1. Open any project. Top right, a small **List / Board** toggle. Board
   lays sections out as columns you can drag tasks between — same tasks,
   same data, just arranged like a kanban board. Whichever one you pick
   is what that project opens to next time, for anyone.
2. **Calendar** in the sidebar — a month view with every task that has a
   due date, from every project, colored by which project it belongs to.
   Drag a task to a different day to reschedule it. Filter by assignee or
   tag at the top right. Click a task to jump to its project.
3. **My Tasks** in the sidebar — everything assigned to you, across every
   project, grouped into Overdue / Today / This week / Later. Check one
   off right there and it disappears — no need to go find it in its
   project.
4. Open any task's detail pane — there's now a **Tags** control next to
   assignee and priority. Type a name; if it doesn't exist yet, "Create"
   makes it on the spot. That's the only way tags get created — there's
   no separate tag-management page, on purpose.

---

## How "per-project view preference remembered" works

Each project already had a `default_view` column sitting unused since
Phase 2 — built for exactly this, now finally wired up. Switching a
project to Board writes that choice back to the project itself, so it's
not a per-browser setting: whoever opens that project next, on any
device, sees whichever view it was last left in.

---

## Two scope decisions, worth knowing about

**Calendar can move a task's date, not edit it.** Dragging a task to a
new day is a real, saved change (just `due_date`, the one field a
reschedule needs). Clicking a task takes you to its project to change
anything else — title, assignee, priority, description. Building a full
edit-anywhere-multi-project detail pane was a much bigger undertaking
than the calendar itself needed for this phase; this was the deliberate
line.

**Tags are intentionally minimal.** A name and an auto-assigned color,
created inline the moment you need one. No color picker, no rename, no
tag-management page, no per-tag task count. If tags turn out to matter
more than that once you're using them for real, extending this is a
small, contained addition — the hard part (the data model, the picker,
the calendar filter) is already built.

---

## Tests

```
npm test
```

This phase added two pure-logic test files, the same "catch the boundary
cases before they catch you" discipline as every phase so far:

- **Task bucketing** (Overdue / Today / This week / Later) — including
  the Sunday and Monday edges, where "this week" starts and ends.
- **Calendar month grid** — every month of a full year, the December →
  January year boundary, and the February leap-year length, checking the
  grid always starts on a Sunday and ends on a Saturday no matter what
  day the 1st falls on.

Both migrations in this phase (0006, plus a fresh run of everything from
0001 forward) were verified against a real, disposable Postgres database
before being handed to you.

---

## What is next — Phase 5

Comments with @mentions, task followers, attachments, an activity feed,
an inbox, recurring tasks, and email notifications for assignment and
anything due tomorrow.
