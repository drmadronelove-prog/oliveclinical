# Phase 2 — Projects and tasks, list view

**What this phase built:** projects with sections inside them, tasks with
fast keyboard entry, a right-hand detail pane, drag to reorder, and
assignee/due date/priority on every task.

Nothing about Phase 1 changed. Sign-in, members, and roles work exactly as
before.

---

## Before you start: run the new database step

This phase adds new tables (projects, sections, tasks). You need to run one
more migration file, the same way you ran the first one.

1. In Supabase, go to **SQL Editor → New query**.
2. Open `supabase/migrations/0002_projects_tasks.sql` from this repo,
   select all of it, and paste it into the editor.
3. Click **Run**. You should see **Success. No rows returned.**

That's it — no other setup, no new keys.

---

## What to click to see it

| Page | What it does |
|---|---|
| `/team/projects` | Every active project, as cards. "New project" to start one. |
| `/team/projects/[id]` | A project: sections, tasks, fast entry, drag to reorder. |

Try this:

1. Go to **Projects**, click **New project**, name it, create it. It starts
   with one section called "To do".
2. Click into the empty row at the bottom that says **Add task**, type a
   title, press **Enter**. Notice the row is ready for the next one
   immediately — that's the whole point of it. Add a few more.
3. Click a task's title to open the detail pane on the right. Set an
   assignee, a due date, and a priority. Type a note in the description box
   and click elsewhere — it saves on its own.
4. Check the box to mark it complete. It goes gray and struck through in
   the list.
5. Drag a task by the grip handle that appears on hover, either to reorder
   it or to drop it into a different section. Prefer the keyboard? Open the
   task and use the **section dropdown** in the picker row instead — it
   does the same move without any dragging.
6. Click **Add section** at the bottom to start a new one — "In progress,"
   "Done," whatever fits how you work.
7. Back on the project page, the small **Archive** button retires a project
   without deleting anything — every task and its history stays intact,
   it just leaves the projects list.

---

## What's new under the hood

Three new kinds of records, all internal-only, nothing client-facing:

- **Projects** — a name, a color, a type (marketing / onboarding /
  general), a status, an optional due date.
- **Sections** — an ordered grouping inside a project. "To do," "In
  progress," whatever you name them.
- **Tasks** — title, an optional plain-text description, assignee, due
  date, priority, done or not, which section it's in.

Any signed-in, active team member can read and write all of it — there is
no per-project or per-task permission system. With two to six people who
all need to see everything, that complexity would only slow the app down,
not protect anyone.

---

## Two deliberate simplifications, decided together

**Plain text, not rich text, for descriptions.** No bold, no bullet lists,
no links — just notes. This was a real choice, not a shortcut: rich text is
a meaningfully bigger build for something that's internal notes on a task,
never a polished document. If that changes, it's a contained upgrade later,
not a rebuild.

**Everyone can edit everything.** Same reasoning as above — admin vs.
member only controls who can manage people (Phase 1), never who can touch
a given task.

---

## What's *not* in this phase yet, by design

These are coming in later phases, not accidentally missing:

- **Board (kanban) and calendar views** — Phase 4. Right now there's only
  the list view you just used.
- **My Tasks, across all projects** — also Phase 4.
- **Comments, followers, attachments, recurring tasks** — Phase 5.
- **Subtasks** — the database already has room for a task to belong to a
  parent task, but there's no way to create one from the screen yet. Small
  addition later once the rest of the shape is settled.
- **Changes appearing live for a second person without refreshing** — the
  page shows the latest data every time you load it or make a change
  yourself, but if two people have the same project open at once, one
  person's edit won't instantly appear on the other's screen without a
  refresh. Real-time sync is explicitly a Phase 5 item (it belongs next to
  comments and the activity feed, which need the same plumbing).

---

## Tests

**Logic tests (Vitest)** — run automatically, no setup:

```
npm test
```

This phase added tests for the position/ordering math (how tasks and
sections stay sorted without renumbering everything on every move), the
priority ordering, and the date helpers (a classic timezone bug — a date
picked as "Mar 14" must never silently become "Mar 13").

**Critical-flow test (Playwright)** — create a task, assign it, complete
it, end to end in a real browser. This one needs a real signed-in account,
so it's off by default. To run it:

1. Add two lines to `.env.local`:
   ```
   PLAYWRIGHT_TEST_EMAIL=you@example.com
   PLAYWRIGHT_TEST_PASSWORD=your-real-password
   ```
   Use your own login — the test signs in, creates a project named
   "Playwright test [timestamp]," and archives it again when done.
2. Run:
   ```
   npm run test:e2e
   ```

Without those two lines, the test skips itself with a clear message rather
than failing — same pattern as the database security tests from Phase 1.

---

## What is next — Phase 3

The onboarding engine — the reason this app exists rather than a
spreadsheet. A template editor for the ~40-step new-hire sequence, an
instantiate flow that turns a template into a real project with real dates
and assignees, and a realistic clinical-hire template seeded in from the
start.
