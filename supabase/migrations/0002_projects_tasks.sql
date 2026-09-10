-- Olive Clinical — Team workspace
-- Migration 0002: Projects, sections, tasks (Phase 2)
--
-- Internal operations data only. See README.md.

-- ---------------------------------------------------------------------
-- 1. Projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  color        text not null default '#7a4f6e',
  type         text not null default 'general' check (type in ('marketing', 'onboarding', 'general')),
  status       text not null default 'on_track' check (status in ('on_track', 'at_risk', 'blocked', 'done')),
  owner_id     uuid references public.profiles (id),
  due_date     date,
  default_view text not null default 'list' check (default_view in ('list', 'board', 'calendar')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  archived_at  timestamptz
);

comment on table public.projects is 'A body of work — a campaign, an onboarding, a general list. Internal operations only.';

create index if not exists projects_active_idx on public.projects (archived_at) where archived_at is null;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 2. Sections — ordered grouping inside a project
-- ---------------------------------------------------------------------
create table if not exists public.sections (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  name        text not null,
  position    double precision not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz
);

comment on table public.sections is 'An ordered grouping of tasks inside a project. Doubles as a board column.';

create index if not exists sections_project_idx on public.sections (project_id, position) where archived_at is null;

drop trigger if exists sections_touch_updated_at on public.sections;
create trigger sections_touch_updated_at
  before update on public.sections
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3. Tasks
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects (id) on delete cascade,
  section_id     uuid not null references public.sections (id) on delete cascade,
  parent_task_id uuid references public.tasks (id) on delete cascade,
  title          text not null,
  description    text,
  assignee_id    uuid references public.profiles (id),
  due_date       date,
  start_date     date,
  priority       text not null default 'none' check (priority in ('none', 'low', 'medium', 'high')),
  completed      boolean not null default false,
  completed_at   timestamptz,
  position       double precision not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  archived_at    timestamptz
);

comment on table public.tasks is 'A unit of work inside a section. parent_task_id makes a subtask (two levels deep — the app does not nest further).';

create index if not exists tasks_section_idx on public.tasks (section_id, position) where archived_at is null;
create index if not exists tasks_project_idx on public.tasks (project_id) where archived_at is null;
create index if not exists tasks_assignee_idx on public.tasks (assignee_id) where archived_at is null;
create index if not exists tasks_parent_idx on public.tasks (parent_task_id) where parent_task_id is not null;

drop trigger if exists tasks_touch_updated_at on public.tasks;
create trigger tasks_touch_updated_at
  before update on public.tasks
  for each row execute function public.touch_updated_at();

-- Keep completed_at consistent with completed, regardless of which
-- client or code path made the change.
create or replace function public.touch_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.completed and not old.completed then
    new.completed_at = now();
  elsif not new.completed and old.completed then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_touch_completed_at on public.tasks;
create trigger tasks_touch_completed_at
  before update on public.tasks
  for each row execute function public.touch_completed_at();

-- ---------------------------------------------------------------------
-- 4. Row-level security
-- ---------------------------------------------------------------------
-- This team is two to six people with no client-facing permissions to
-- model, so the rule is simple: any signed-in, non-archived member can
-- read and write every project, section, and task. Admin vs. member only
-- matters for managing people (see migration 0001), never for task work.

alter table public.projects enable row level security;
alter table public.sections enable row level security;
alter table public.tasks    enable row level security;

drop policy if exists projects_all_members on public.projects;
create policy projects_all_members on public.projects
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

drop policy if exists sections_all_members on public.sections;
create policy sections_all_members on public.sections
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

drop policy if exists tasks_all_members on public.tasks;
create policy tasks_all_members on public.tasks
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

revoke all on public.projects from anon;
revoke all on public.sections from anon;
revoke all on public.tasks    from anon;
grant all on public.projects to authenticated;
grant all on public.sections to authenticated;
grant all on public.tasks    to authenticated;
