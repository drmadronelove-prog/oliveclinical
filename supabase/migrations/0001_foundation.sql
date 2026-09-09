-- Olive Clinical — Team workspace
-- Migration 0001: Foundation (profiles, roles, row-level security)
--
-- This database holds INTERNAL OPERATIONS DATA ONLY: campaigns, tasks,
-- hiring checklists, and notes about our own processes. No client names,
-- no clinical content, no PHI. See README.md.

-- ---------------------------------------------------------------------
-- 1. Profiles
-- ---------------------------------------------------------------------
-- Supabase keeps login credentials in its own `auth.users` table, which we
-- are not allowed to add columns to. `profiles` is our mirror of it: one
-- row per person, holding the things the app needs to show (name, avatar,
-- role). The two are linked by a shared id.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text,
  avatar_url  text,
  role        text not null default 'member' check (role in ('admin', 'member')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz
);

comment on table public.profiles is
  'One row per team member. Mirrors auth.users. Internal operations only — no client or patient data.';

create index if not exists profiles_active_idx
  on public.profiles (archived_at) where archived_at is null;

-- ---------------------------------------------------------------------
-- 2. Keep updated_at honest
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3. Create a profile automatically whenever someone accepts an invite
-- ---------------------------------------------------------------------
-- When you invite someone, Supabase creates the auth.users row. This
-- trigger creates their matching profile in the same instant, so there is
-- never a signed-in person without a profile.
--
-- The role and name come from the invite metadata we set when sending it.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'member')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 4. Role helper
-- ---------------------------------------------------------------------
-- A security policy on `profiles` cannot itself read `profiles` — Postgres
-- would loop forever. `security definer` lets this function read the table
-- once, outside the policy system, and just answer yes or no.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and archived_at is null
  );
$$;

create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and archived_at is null
  );
$$;

-- ---------------------------------------------------------------------
-- 5. Row-level security
-- ---------------------------------------------------------------------
-- With RLS on and no policy matching, Postgres returns nothing. So an
-- unauthenticated request gets an empty result, not a leak — the database
-- refuses even if the application code has a bug.

alter table public.profiles enable row level security;

drop policy if exists profiles_select_members on public.profiles;
create policy profiles_select_members on public.profiles
  for select to authenticated
  using (public.is_active_member());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert or delete policy on purpose. Profiles are created by the
-- signup trigger above and retired by setting archived_at, never deleted.

-- ---------------------------------------------------------------------
-- 6. Lock the door on the anonymous role
-- ---------------------------------------------------------------------
revoke all on public.profiles from anon;
grant select, update on public.profiles to authenticated;
