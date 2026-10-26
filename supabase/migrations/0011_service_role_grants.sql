-- Olive Clinical — Team workspace
-- Migration 0011: grant the Data API's service role explicitly
--
-- From 2026-10-30 Supabase stops automatically granting Data API access
-- to new tables in "public". Existing tables keep the grants they have,
-- so the live project is unaffected — but a schema recreated from these
-- migrations after that date is not: a new project, a Vercel preview
-- branch with its own branch database, or a local `supabase db reset`.
--
-- Migrations 0001–0010 each already grant their own tables to
-- `authenticated` and revoke them from `anon`, so those paths were
-- never relying on the implicit grants. `service_role` was: nothing in
-- this repo has ever granted to it, and app/api/team/notify-webhook/
-- route.ts reads public.profiles and public.tasks through the Data API
-- with the service-role client to find out who a notification email
-- goes to. On a freshly created schema those two reads would come back
-- "permission denied" and email notifications would stop while the
-- in-app ones kept working — the quiet kind of failure. (The invite and
-- member-delete paths in app/team/(workspace)/members/actions.ts go
-- through auth.admin.*, the Auth API rather than the Data API, so they
-- were never affected either way.)
--
-- This grants all fourteen tables rather than only the two read today,
-- and `all` rather than `select`, because the point of the migration is
-- to make a recreated schema behave exactly like the live project — and
-- that is what `service_role` holds there now, by inheritance.
-- Narrowing it here would trade one prod/preview divergence for
-- another, which is worse than either consistent choice: a preview
-- branch that quietly behaves differently from production is the thing
-- this is meant to prevent. `service_role` bypasses row-level security
-- regardless, so these grants are not what contains it; the secret key
-- being server-only is.
--
-- Running this against the live project is a no-op, since `service_role`
-- already has these privileges there. It only makes the inherited state
-- explicit, so it survives the schema being rebuilt.
--
-- Deliberately *only* service_role. The per-table `revoke ... from
-- anon` and `grant ... to authenticated` lines stay in the migrations
-- that create each table, where they can be read next to the columns
-- and the RLS policy they go with. Restating them here would make a
-- second source of truth for the same privileges, and they are not
-- uniform — `profiles` is select/update only (0001) and `activity_log`
-- is append-only (0007) — so a copy would be one edit away from
-- silently widening a table it was meant to document.
--
-- NOTE for future migrations: a new table in "public" now needs its
-- grants written into the same migration that creates it. Follow the
-- lines at the bottom of 0010, plus a service_role line — not
-- Supabase's suggested snippet, which grants `select` to `anon` and
-- would expose an internal workspace table to unauthenticated
-- requests.
--
-- `alter default privileges` would restore the old implicit behaviour
-- in one statement, but it applies only to objects created by the role
-- that ran it, which is not guaranteed to be the same role locally and
-- in CI — and it rebuilds the footgun Supabase is removing. Explicit
-- per-table grants are the duller, more durable answer.
--
-- No sequence or function grants are needed: every primary key is a
-- uuid default gen_random_uuid(), there are no views in "public", and
-- the app makes no .rpc() calls, so tables are the whole Data API
-- surface.

grant all on public.profiles          to service_role;
grant all on public.projects          to service_role;
grant all on public.sections          to service_role;
grant all on public.tasks             to service_role;
grant all on public.project_templates to service_role;
grant all on public.template_sections to service_role;
grant all on public.template_tasks    to service_role;
grant all on public.tags              to service_role;
grant all on public.task_tags         to service_role;
grant all on public.comments          to service_role;
grant all on public.notifications     to service_role;
grant all on public.activity_log      to service_role;
grant all on public.attachments       to service_role;
grant all on public.project_resources to service_role;
