-- Olive Clinical — Team workspace
-- Migration 0004: the onboarding engine (Phase 3)
--
-- Internal operations data only. See README.md.

-- ---------------------------------------------------------------------
-- 1. Project templates
-- ---------------------------------------------------------------------
create table if not exists public.project_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz
);

comment on table public.project_templates is
  'A reusable recipe for a project — name it, give it sections and tasks with relative timing. Instantiating one copies its shape into a real project; editing the template afterward never touches a project already made from it.';

create index if not exists project_templates_active_idx
  on public.project_templates (archived_at) where archived_at is null;

drop trigger if exists project_templates_touch_updated_at on public.project_templates;
create trigger project_templates_touch_updated_at
  before update on public.project_templates
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 2. Template sections — mirrors public.sections
-- ---------------------------------------------------------------------
create table if not exists public.template_sections (
  id          uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.project_templates (id) on delete cascade,
  name        text not null,
  position    double precision not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists template_sections_template_idx
  on public.template_sections (template_id, position) where archived_at is null;

drop trigger if exists template_sections_touch_updated_at on public.template_sections;
create trigger template_sections_touch_updated_at
  before update on public.template_sections
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3. Template tasks
-- ---------------------------------------------------------------------
-- The whole point of a template: offset_days and default_assignee_role
-- stand in for a real due_date and a real assignee_id, which only exist
-- once someone actually instantiates the template.
create table if not exists public.template_tasks (
  id                    uuid primary key default gen_random_uuid(),
  template_id           uuid not null references public.project_templates (id) on delete cascade,
  template_section_id   uuid not null references public.template_sections (id) on delete cascade,
  title                 text not null,
  offset_days           integer not null default 0,
  default_assignee_role text,
  position              double precision not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  archived_at           timestamptz
);

comment on column public.template_tasks.offset_days is
  'Days relative to the anchor (start) date chosen at instantiation. Negative means before the start date — e.g. -14 for "send the offer letter" two weeks out.';
comment on column public.template_tasks.default_assignee_role is
  'A free-text placeholder like "Supervisor" or "IT" — not a real person. Instantiating a template asks who fills each distinct role that appears in it.';

create index if not exists template_tasks_section_idx
  on public.template_tasks (template_section_id, position) where archived_at is null;
create index if not exists template_tasks_template_idx
  on public.template_tasks (template_id) where archived_at is null;

drop trigger if exists template_tasks_touch_updated_at on public.template_tasks;
create trigger template_tasks_touch_updated_at
  before update on public.template_tasks
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 4. Row-level security — same rule as every other Phase 2/3 table:
--    any signed-in, active member reads and writes all of it.
-- ---------------------------------------------------------------------
alter table public.project_templates enable row level security;
alter table public.template_sections enable row level security;
alter table public.template_tasks    enable row level security;

drop policy if exists project_templates_all_members on public.project_templates;
create policy project_templates_all_members on public.project_templates
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

drop policy if exists template_sections_all_members on public.template_sections;
create policy template_sections_all_members on public.template_sections
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

drop policy if exists template_tasks_all_members on public.template_tasks;
create policy template_tasks_all_members on public.template_tasks
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

revoke all on public.project_templates from anon;
revoke all on public.template_sections from anon;
revoke all on public.template_tasks    from anon;
grant all on public.project_templates to authenticated;
grant all on public.template_sections to authenticated;
grant all on public.template_tasks    to authenticated;
