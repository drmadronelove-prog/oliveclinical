-- Olive Clinical — Team workspace
-- Migration 0006: tags (Phase 4 — needed for the calendar's tag filter)

create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  color       text not null default '#5b6e88',
  created_at  timestamptz not null default now(),
  archived_at timestamptz,
  unique (name)
);

comment on table public.tags is
  'Labels shared across projects — e.g. podcast, credentialing, website. Created inline from the tag picker on a task, not from a dedicated management page.';

create table if not exists public.task_tags (
  task_id    uuid not null references public.tasks (id) on delete cascade,
  tag_id     uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, tag_id)
);

create index if not exists task_tags_tag_idx on public.task_tags (tag_id);

alter table public.tags      enable row level security;
alter table public.task_tags enable row level security;

drop policy if exists tags_all_members on public.tags;
create policy tags_all_members on public.tags
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

drop policy if exists task_tags_all_members on public.task_tags;
create policy task_tags_all_members on public.task_tags
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

revoke all on public.tags      from anon;
revoke all on public.task_tags from anon;
grant all on public.tags      to authenticated;
grant all on public.task_tags to authenticated;
