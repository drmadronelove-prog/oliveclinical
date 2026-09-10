# Phase 5 — Collaboration and recurrence

**What this phase built:** comments with @mentions on every task, an
automatic activity feed (who changed what, and when), file attachments,
recurring tasks that create their own next occurrence, an Inbox that
collects assignments, mentions, comments, and due-tomorrow reminders in
one place, and — the same day, once you'd decided you wanted it — real
email delivery for all four of those, via Resend.

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

## Setting up email notifications (optional)

Every notification — assignment, mention, comment, due-tomorrow — shows
up in Inbox the moment it happens, with no setup at all. Email on top of
that is optional, and off by default: skip this whole section and
nothing changes.

**How it works:** rather than having the database itself try to send
email (which would mean giving Postgres its own copy of your email
provider's key), each new row in the `notifications` table triggers a
**Supabase Database Webhook** — a built-in Supabase feature — that POSTs
to a new route in this app, `/api/team/notify-webhook`. That route looks
up who the notification is for, sends one email through
[Resend](https://resend.com), and returns. If email isn't configured, or
the send fails, the route just reports that — the in-app notification
that was already created is never affected either way.

**Setup, in order:**

1. **Resend** → sign up (free tier is generous for a team this size) →
   **API Keys** → create one → copy it.
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` — the key from step 1.
   - `TEAM_NOTIFY_WEBHOOK_SECRET` — any long random string you make up
     yourself (a password manager's "generate password" is fine). This
     is what proves a request to the webhook route really came from
     Supabase and not a stranger on the internet.
   - `EMAIL_FROM` — optional. Until you verify a domain in Resend (next
     step), leave this unset; emails will send from Resend's own testing
     address and only reach your own Resend account email, which is
     enough to confirm everything is wired correctly before going
     further.
3. **Verify a sending domain** (needed for email to actually reach your
   team, not just your own inbox): Resend → **Domains → Add Domain** →
   `oliveclinical.com` → add the DNS records it gives you wherever your
   domain's DNS is managed → wait for Resend to show it verified (can
   take a few minutes to a few hours). Once verified, set `EMAIL_FROM` to
   something like `Olive Team <team@oliveclinical.com>` and redeploy.
4. Redeploy (any push does this) so Vercel picks up the new environment
   variables.
5. Supabase → **Database → Webhooks → Create a new hook**:
   - Table: `notifications`. Events: **Insert** only.
   - Type: **HTTP Request**, method **POST**.
   - URL: `https://oliveclinical.com/api/team/notify-webhook`.
   - Headers: add one, `Authorization` → `Bearer <the same
     TEAM_NOTIFY_WEBHOOK_SECRET you set in Vercel>`.
   - Save.

That's it — the next assignment, mention, comment, or due-tomorrow check
will also land in an inbox, not just Inbox.

**If it's not arriving:** check Supabase → Database → Webhooks → your
hook → **Logs** first; it shows every attempt and the response this app
sent back (401 means the secret doesn't match between the two places you
pasted it; 501 means Vercel doesn't have `TEAM_NOTIFY_WEBHOOK_SECRET`
set). If it shows `200` but nothing arrives, check that `EMAIL_FROM`'s
domain shows verified in Resend — an unverified domain silently only
delivers to your own Resend account address.

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

**Email is best-effort on top of Inbox, never a replacement for it.**
The webhook route always has a real, already-saved notification behind
it — a bad API key, a Resend outage, or an unverified domain degrades to
"this one didn't get emailed," never to a lost notification. The same
sentence describing a notification in Inbox is reused verbatim in the
email (`lib/team/notification-copy.ts`), so the two can't drift apart
into saying different things about the same event.

---

## Tests

```
npm test
```

This phase added four pure-logic test files:

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
- **Notification copy** — the sentence and subject line for each
  notification type, including the due-soon reminder's different shape
  (no actor) and the fallbacks when a task or actor is missing.

The webhook route's secret check (`timingSafeEqual`, not `===`, so a
wrong secret can't be guessed faster by how quickly it fails) was
verified directly rather than through Vitest, since exercising a real
Next.js route handler needs more scaffolding than the check itself
warrants.

---

## What is next — Phase 6

Search, a command palette, exports, and a project overview.
