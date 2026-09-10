# Phase 3 — The onboarding engine

**What this phase built:** a template editor, an instantiate flow that
turns a template into a real project with real dates and real people, and
a realistic 40-step clinical-hire template ready to use immediately.

Nothing about Phases 1 or 2 changed.

---

## Before you start: two more database steps

Run these in order — same drill as before.

1. Supabase → **SQL Editor → New query** → paste
   `supabase/migrations/0004_onboarding_templates.sql` → **Run**.
2. **New query** again → paste
   `supabase/migrations/0005_seed_clinical_onboarding_template.sql` →
   **Run**. This one adds the actual 40-step "Clinical hire onboarding"
   template so there's something to try immediately, not just an empty
   editor.

Both were tested against a real Postgres database before being handed to
you — run start to finish, including the seed step run twice in a row to
confirm it never creates duplicates.

---

## What to click to see it

1. Go to **Templates** in the sidebar. You'll see **Clinical hire
   onboarding**, already seeded, with four sections: Pre-start, Week 1,
   First 30 days, First 90 days.
2. Click it to open the editor. Each task shows its title, how many days
   from the start date it lands on (negative means before), and a role
   like "Supervisor" or "IT" — a placeholder, not a real person yet.
   Click any of those to edit them. Use the small up/down arrows to
   reorder a task within its section.
3. Go back to Templates and click **Use template**. This is the
   instantiate flow:
   - Name the project — something like "Onboarding — J. Rivera".
   - Pick their actual start date.
   - For each role the template uses (Admin, Supervisor, IT, and so on),
     pick who that is for this hire. The same person can fill more than
     one role.
   - Watch the preview on the right update live — every task's real
     calendar date, and who it lands on.
   - **Create project** turns that preview into an actual project, with
     real dates and real assignees, sitting right alongside your other
     projects.
4. **Duplicate** on a template's card makes an independent copy you can
   reshape without touching the original — useful for a role-specific
   variant (say, a shorter onboarding for a contractor) without losing the
   full-time template.

---

## How the dates and assignments actually work

A template task doesn't store a date or a person — it stores an **offset**
(days from the start date) and a **role** (a name, not an account). Those
only become real at the moment you instantiate:

- `due_date` = the start date you picked, plus that task's offset. "-14"
  becomes an actual date two weeks before day one.
- `assignee_id` = whoever you mapped that role to. A role you leave
  unmapped just creates the task unassigned — it never blocks the rest of
  the project from being created.

Editing a template afterward — even deleting it — never touches a project
already made from it. Instantiating **copies** the template's shape into
real rows; there's no live link back to the template once that happens.

---

## Two deliberate simplifications

**No drag-and-drop in the template editor.** The project board (Phase 2)
lets you drag tasks around; the template editor uses small up/down arrows
instead. Reordering a template happens far less often than reordering a
live project's tasks, so the lighter-weight control was the right tradeoff
here — full drag support is a small addition later if it turns out to
matter.

**Template tasks have no description field.** Title, timing, and role
only. Once instantiated, every real task gets the full rich-text
description from Phase 2 — empty at first, ready to fill in — so nothing
is lost, it just isn't authored at the template level.

---

## Tests

```
npm test
```

This phase added tests for the date arithmetic templates depend on —
adding and subtracting offsets, including the cases most likely to hide a
bug: crossing a month boundary, crossing a year boundary, and the
February leap-year edge. All built from date *parts* (year, month, day)
rather than millisecond math, so nothing drifts across a timezone or a
daylight-saving change.

The two new migrations were also run against a real, disposable Postgres
database as part of building this phase — not just read over — including
confirming the seed step is safe to run more than once.

---

## What is next — Phase 4

Board (kanban) and calendar views — the calendar is the real marketing
planning surface the original brief asked for, with drag-to-reschedule.
Plus **My Tasks**: everything assigned to you, across every project,
grouped into Today / This week / Later / Overdue.
