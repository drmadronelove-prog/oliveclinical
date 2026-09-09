# Phase 1 — Foundation

**What this phase built:** a private, invite-only sign-in at
`oliveclinical.com/team`, a members page where you add people by email, a
profile settings page, and the app shell (sidebar, dark mode) that every
later phase hangs off.

Nothing about the public marketing site changed. It builds and serves
exactly as before, with or without any of the setup below.

---

## Part 1 — Set up Supabase (about 10 minutes, one time)

Supabase is the database and the login system. The free tier is far more
than this needs. You do not need a credit card.

### 1. Make an account

1. Go to **https://supabase.com** and click **Start your project**.
2. Sign in with GitHub (easiest, you already have an account from this repo)
   or with your email address.

### 2. Create the project

1. Click **New project**.
2. **Name:** `olive-clinical`
3. **Database Password:** click **Generate a password**, then copy it and
   paste it somewhere safe — your password manager, not a text file. You
   will almost certainly never need it, but it cannot be recovered.
4. **Region:** `West US (North California)` — closest to Berkeley.
5. Click **Create new project** and wait about two minutes.

### 3. Create the tables

1. In the left sidebar click **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/migrations/0001_foundation.sql` from this repo,
   select all of it, and paste it into the editor.
4. Click **Run** (or press Cmd+Enter).
5. You should see **Success. No rows returned.** That is what success looks
   like for this kind of command — it created things rather than finding
   things.

### 4. Copy your three keys

Supabase splits these across two pages under **Project Settings**.

**Page one — Settings → Data API.** Copy the **Project URL**. It looks like
`https://abcdefgh.supabase.co`.

**Page two — Settings → API Keys.** You need two keys from here. Supabase
now offers two generations of keys and **either generation works** with this
app — pick one row and stay consistent.

*If you see a "Publishable key" and a "Secret keys" section (newer projects):*

| You need | What to copy | Looks like |
|---|---|---|
| Public key | **Publishable key** | `sb_publishable_...` |
| Secret key | **Secret keys** → reveal or **Create new secret key** | `sb_secret_...` |

*If you see an "anon / service_role" table, or a **Legacy API Keys** tab:*

| You need | What to copy | Looks like |
|---|---|---|
| Public key | the **anon** / **public** row | a long `eyJ...` string |
| Secret key | the **service_role** row — click **Reveal** | another long `eyJ...` string |

Newer keys are the ones Supabase is moving to, so prefer
`sb_publishable_` / `sb_secret_` if both are offered.

> **About the secret key.** It ignores every security rule in the database.
> It is used in exactly one place in this app — sending invitations — and
> only ever on the server. Do not paste it into a browser, an email, or any
> file other than the two places below.

### 5. Put the keys in the project

In the project folder on your computer, create a file named exactly
`.env.local` (note the leading dot) next to `package.json`, containing:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-the-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-the-service-role-key-here
```

There is a template at `.env.example` you can copy. `.env.local` is
git-ignored, so it will never be committed or published.

The variable names still say `ANON_KEY` and `SERVICE_ROLE_KEY` because those
are the names every Supabase guide uses. A newer `sb_publishable_...` key
goes in the `ANON_KEY` line and a newer `sb_secret_...` key goes in the
`SERVICE_ROLE_KEY` line — the app does not care which generation you used.

### 6. Tell Supabase where the app lives

1. In Supabase, go to **Authentication → URL Configuration**.
2. Set **Site URL** to: `https://oliveclinical.com`
3. Under **Redirect URLs**, click **Add URL** and add each of these, one at
   a time:
   - `https://oliveclinical.com/team/auth/callback`
   - `http://localhost:3000/team/auth/callback`
4. Click **Save**.

Without this step, invitation and password-reset links will refuse to open.

### 7. Turn off public sign-up

1. Go to **Authentication → Sign In / Providers → Email**.
2. Turn **Enable email signups** **off**.
3. Leave **Confirm email** on.
4. Click **Save**.

The app has no sign-up form, but this makes it impossible at the database
level too — belt and braces.

---

## Part 2 — Make yourself the first admin

Someone has to be the first admin, and admins are created by other admins.
So the very first one is made by hand. This is the only time you will do
this.

1. In Supabase go to **Authentication → Users** and click **Add user →
   Send invitation** (or **Invite user**).
2. Enter your email: `madrone@madronelove.com`. Click send.
3. Check your inbox and click the link. It will bring you to
   `/team/update-password` where you choose a password.
4. Now go back to Supabase, open **SQL Editor → New query**, and run this
   single line to promote yourself:

```sql
update public.profiles set role = 'admin' where email = 'madrone@madronelove.com';
```

5. Reload `oliveclinical.com/team`. You should now see **Members** in the
   sidebar. Every future person gets invited from that page instead.

---

## Part 3 — Run it locally

In a terminal, from the project folder:

```
npm install
npm run dev
```

Then open **http://localhost:3000/team** in your browser.

To run the tests:

```
npm test
```

---

## Part 4 — Deploy to oliveclinical.com

Your site deploys from Vercel whenever `main` updates. Vercel needs the same
three keys, because `.env.local` stays on your computer.

1. Go to **https://vercel.com**, open the project for oliveclinical.com.
2. Click **Settings → Environment Variables**.
3. Add all three, one at a time. For each, tick **Production**,
   **Preview**, and **Development**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **Deployments**, open the most recent one, and click
   **Redeploy**. Environment variables only take effect on a new build.

---

## What to click to see it

| Page | What it does |
|---|---|
| `/team` | Home. Greets you, shows what is built and what is coming. |
| `/team/login` | Sign in. No sign-up link, on purpose. |
| `/team/reset-password` | Emails a reset link. |
| `/team/members` | **Admins only.** Invite by email, set role, remove access. |
| `/team/settings` | Your display name; shows your email and role. |
| Sidebar bottom | Dark mode toggle and sign out. |

---

## Things worth knowing

**Security is enforced twice, independently.** The app redirects signed-out
visitors away from `/team`. Separately, every table in the database has
row-level security, so even someone holding the public key and talking
straight to the database gets nothing back without a valid session. A bug in
the app code cannot expose data on its own. `npm test` includes tests that
attack the database directly with no session and assert they come away
empty-handed.

**You cannot lock yourself out.** The Members page will not let you change
your own role or remove your own access.

**"Remove access" is not delete.** It sets an `archived_at` date. The person
can no longer sign in or read anything, but the work they did stays
attributed to them. It can be undone with **Restore access**.

**Email limits.** Supabase's built-in email sender allows only a handful of
messages per hour, which is fine for a team of six but will feel slow if you
invite several people at once. If it becomes annoying we can connect a real
email service in Phase 5, when notification emails arrive anyway.

**Dark mode is workspace-only.** The toggle affects `/team`, not the public
site, and is remembered per browser.

**One known cosmetic tradeoff.** The public site's header and footer are
hidden on `/team` by a small client-side component rather than by moving all
twenty marketing pages into a Next.js route group. The footer's markup is
still sent (invisibly) inside the page data for `/team` pages. It is not
displayed and costs a few kilobytes. This was the deliberate choice because
moving every marketing route could collide with the v0 integration that
pushes commits to this repo.

---

## Deviations from the original build plan

**Prisma was dropped.** The plan called for Prisma as the ORM. This app uses
the Supabase client directly with plain SQL migrations in
`supabase/migrations/` instead. Prisma would have added a second database
connection string, a code-generation step during build, and connection
pooling configuration — three new ways for the *live marketing site* to fail
to deploy, in exchange for convenience this app is too small to need. Your
migrations are still committed to the repo and still run in order; you paste
them into Supabase's SQL editor rather than running a command.

**Playwright starts in Phase 2.** Phase 1 has no task flows to click
through yet. Vitest is set up and running now.

---

## What is next — Phase 2

Projects and tasks with a list view: create projects and sections, fast
keyboard task entry (type a title, press Enter, the next row appears and
holds focus), assignee and due date and priority, a right-hand detail pane
that opens without leaving the page, and drag to reorder.

**Before Phase 2 starts, do Parts 1 and 2 above.** Phase 2 needs a working
database to build against.
