-- Olive Clinical — Team workspace
-- Migration 0010: project-level links and uploaded files
--
-- Attachments (0008) hang off a single task. This is the project-wide
-- counterpart — a brand brief, a shared doc link, an asset a whole
-- project needs, not just one task's worth. One table covers both a
-- link (kind = 'link', url set) and an uploaded file (kind = 'file',
-- storage_path set) rather than two near-identical tables, since the
-- app lists and deletes them exactly the same way either way.
--
-- Uploaded files reuse the same private 'task-attachments' Storage
-- bucket 0008 already created and already scoped to any active member —
-- there is nothing bucket-specific about task attachments vs. project
-- files, so a second bucket would just be two RLS policies to keep in
-- sync for no real separation. Project files are told apart by their
-- path prefix (project/<project_id>/... vs a task's <task_id>/...), not
-- a different bucket.

create table if not exists public.project_resources (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  kind          text not null check (kind in ('link', 'file')),
  title         text not null,
  url           text,
  storage_path  text,
  file_size     bigint,
  content_type  text,
  created_by    uuid references public.profiles (id),
  created_at    timestamptz not null default now(),
  archived_at   timestamptz,
  constraint project_resources_kind_fields check (
    (kind = 'link' and url is not null and storage_path is null) or
    (kind = 'file' and storage_path is not null and url is null)
  )
);

comment on table public.project_resources is 'Links and uploaded files that belong to a whole project rather than one task.';

create index if not exists project_resources_project_idx on public.project_resources (project_id) where archived_at is null;

alter table public.project_resources enable row level security;

drop policy if exists project_resources_all_members on public.project_resources;
create policy project_resources_all_members on public.project_resources
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

revoke all on public.project_resources from anon;
grant all on public.project_resources to authenticated;
