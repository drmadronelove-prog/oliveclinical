# Phase 5 — Collaboration and recurrence

**What this phase built:** comments with @mentions on every task, an
automatic activity feed (who changed what, and when), file attachments,
recurring tasks that create their own next occurrence, and an Inbox that
collects assignments, mentions, comments, and due-tomorrow reminders in
one place.

Nothing about Phases 1–4 changed.

---

## Before you start: three more database steps

Run these in order — each depends on the one before it.

1. Supabase → **SQL Editor → New query** → paste
   `supabase/migrations/0007_collaboration_and_recurrence.sql` → **Run**.
2. New query → paste `supabase/migrations/0008_attachments.sql` → **Run**.
3. New query → paste `supabase/migrations/0009_due_soon_reminders.sql` →
   **Run**.

Migration 0009 tries to turn on the `pg_cron` extension so the "due
tomorrow" check can run on its own every morning. If that line errors
with a permissions message, go to Supabase → **Database → Extensions**,
search for `pg_cron`, enable it there, then re-run just this migration.
Everything else in it is safe to run again if needed.

All three were run end-to-end against a real, disposable Postgres
database — including the full chain from 0001 forward — before being
handed to you. The trigger *behavior*, not just the schema, was tested
with real data: assignment notifications firing on insert and reassign,
the activity log logging exactly the fields that actually changed,
recurring tasks computing the correct next date (weekly, biweekly,
monthly, quarterly, including month-end overflow), and a completed task
never spawning a duplicate if it's marked complete twice. The one piece
that couldn't be tested locally is the daily schedule itself — this
sandbox's Postgres doesn't have `pg_cron` installed, only Supabase's
hosted one does — so the reminder *logic* is proven, but the "runs
automatically every morning" part will get its first real test once it's
live on your data. If tomorrow comes and nothing shows up in Inbox for a
task due the next day, that's the first place to look.

---

## What to click to see it

1. Open any task's detail pane. Scroll down — **Attachments**,
   **Activity**, and **Comments** sections, in that order, below the
   description.
2. **Attachments** — drop a file in (25MB limit, no executables). Click
   to download, or remove it.
3. **Activity** — closed by default, click to expand. A plain-language
   log: "Jordan reassigned this from Unassigned to Madrone Love,"
   "Admin marked this complete." Filled in automatically — nothing to
   turn on.
4. **Comments** — write a note, or click one of the name chips above the
   box to insert `@Their Name` at your cursor. Mentioning someone, or
   commenting on a task assigned to someone else, notifies them.
5. Near the top of the detail pane, next to Tags — a **Repeat** picker:
   doesn't repeat, weekly, every 2 weeks, monthly, quarterly. Pick one
   (needs a due date) and it shows a live preview of the next date. Check
   the task off and the next one appears on its own, same project,
   section, assignee, and priority.
6. **Inbox** in the sidebar, right under Home. A badge shows your unread
   count. Click anything in it to jump straight to that task; **Mark all
   as read** clears the badge.

---

## How "task followers" actually works

There's no follow/unfollow button. Instead, two things notify you
automatically: being a task's **assignee** (any comment on it reaches
you), and being **@mentioned** by name in a comment. That covers the
real cases — "tell the person doing the work" and "tell the person I'm
calling out" — without a separate list to maintain per task.

Comment @mentions work by matching `@Full Name` against the project's
member list, not free-text search or an autocomplete dropdown — the chip
row above the comment box is the whole interface for it. Simple, and
correct as long as people don't have identical display names.

---

## How the activity log and recurrence stay reliable everywhere

Both are implemented as database triggers on the `tasks` table itself,
not as code in any one screen. List, Board, My Tasks, Calendar, and the
detail pane all end up doing the same `update tasks set completed = ...`
underneath, so there was no way to "forget" to wire up recurrence or
logging on one of them — the database enforces it regardless of which
screen made the change.

---

## What's deliberately not built yet: real email

Everything above is **in-app only**. Assignments, mentions, comments, and
due-tomorrow reminders all show up in Inbox the moment they happen — but
nothing is emailed. Adding real email delivery (most likely through a
service like Resend) means signing up for a paid service and giving it
somewhere to send from, which is exactly the kind of decision the working
agreement says to bring to you rather than set up on my own. I built
everything else in this phase first so that decision wouldn't hold up the
rest of it — now that it's the only thing left, it's yours to make
whenever you're ready.

---

## Two smaller scope decisions, worth knowing about

**Attachments are metadata-first.** The file itself uploads straight
from your browser to Supabase Storage — the server only ever records
*that* a file exists (name, size, who uploaded it), never the bytes
themselves. Keeps task data and file data cleanly separate, and means
uploading doesn't get slower as files get bigger.

**Comments and attachments load with the project, like tags did in Phase
4.** Same tradeoff as before: fine for a project's worth of history on a
team this size, and the first thing to revisit if a project ever
accumulates a very large comment or attachment history.

---

## Tests

```
npm test
```

This phase added three pure-logic test files:

- **@mention parsing** — two-word names, case-insensitivity, multiple
  mentions in one comment, no false match on a name mentioned without an
  `@`, no partial-name match, and the email fallback for anyone who
  hasn't set a display name yet.
- **Recurrence date math** — weekly, biweekly, monthly, and quarterly,
  including the same month-end overflow behavior Postgres itself uses
  (e.g. Jan 31 + 1 month), so the "next: ..." preview in the picker never
  disagrees with what the database actually creates.
- **Relative time formatting** — "just now" through "6d ago," and the
  handoff to a plain short date once something is over a week old.

---

## What is next — Phase 6

Search, a command palette, exports, and a project overview — plus,
whenever you're ready, the email decision above.
