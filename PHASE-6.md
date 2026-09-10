# Phase 6 — Search, command palette, exports, project overview

**What this phase built:** a Cmd/Ctrl+K command palette that jumps to
any page or searches projects and tasks by name from anywhere in the
workspace, a CSV export button on every project, and a third Overview
tab alongside List and Board — a snapshot of a project's progress,
overdue count, and recent activity across every task at once.

This is the last phase in the original build plan. Nothing about
Phases 1–5 changed, and no database migration is needed.

---

## What to click to see it

1. From anywhere in `/team`, press **⌘K** (Mac) or **Ctrl+K**
   (Windows/Linux) — or click **Search** near the top of the sidebar.
   With nothing typed, it lists every page you can jump to (Home,
   Inbox, My Tasks, Calendar, Projects, Templates, Members if you're an
   admin, Settings). Type two or more characters and it searches
   project names and task titles instead, live as you type. Picking a
   task takes you straight to its project with the detail pane already
   open — the same jump the Inbox uses.
2. Open any project. Next to the List/Board toggle, top left, an
   **Export CSV** button — downloads that project's active tasks (title,
   section, assignee, due date, priority, status, tags) as a spreadsheet
   file, ready to open in Excel, Numbers, or Google Sheets.
3. Same toggle group, a third option: **Overview**. Total tasks,
   completed, overdue, and due this week at a glance, an overall
   progress bar, a per-section breakdown, and the dozen most recent
   changes across the whole project — not just one task's history, like
   the Activity section in a task's detail pane already showed.

---

## Two scope decisions, worth knowing about

**Overview is a snapshot, not a fourth place to plan work.** Unlike
List and Board, picking it doesn't get remembered as the project's
default view — it resets to whichever of List or Board you had chosen
last, the next time anyone opens the project. It's a page you check in
on, not one you live in.

**Search covers projects and tasks, not comments or activity.** Typing
a phrase that only appears inside a comment won't surface that task.
Titles and names are what people actually remember and search for in
practice; searching comment text too is a straightforward addition
later if it turns out to matter.

---

## Tests

```
npm test
```

This phase added two pure-logic test files:

- **CSV building** — cell quoting and escaping (a comma, a quote, a
  newline inside a value), and the exact row shape produced for a task,
  including the blank cells when assignee, due date, or tags aren't set.
- **Activity descriptions** — the same sentence-building logic now
  shared between a task's own Activity section and the project-wide
  Overview feed, including the one difference between them: Overview
  appends which task each change was on, since "this" alone would be
  ambiguous outside a single task's detail pane.

The command palette's search itself is a thin server action over two
`ilike` queries — no pure logic worth isolating, so it's exercised only
through the typecheck and build, the same as this app's other simple
data-fetching actions.

---

## What is next

There's no Phase 7 planned. Everything in the original brief is built:
sign-in, projects and tasks, onboarding templates, board and calendar
views, comments and recurrence with email notifications, and now search
and exports. From here it's real usage that should drive what comes
next — whatever turns out to be missing once the whole team is actually
running marketing work and onboarding through it day to day.
