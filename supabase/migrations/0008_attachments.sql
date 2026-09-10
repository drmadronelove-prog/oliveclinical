-- Olive Clinical — Team workspace
-- Migration 0008: file attachments on tasks (Phase 5)
--
-- Files themselves live in Supabase Storage, in a bucket this migration
-- creates. This table is just the metadata (which task, whose upload,
-- what it was called) that lets the app list and link to them.

create table if not exists public.attachments (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references public.tasks (id) on delete cascade,
  storage_path  text not null,
  file_name     text not null,
  file_size     bigint,
  content_type  text,
  uploaded_by   uuid references public.profiles (id),
  created_at    timestamptz not null default now()
);

create index if not exists attachments_task_idx on public.attachments (task_id);

alter table public.attachments enable row level security;

drop policy if exists attachments_all_members on public.attachments;
create policy attachments_all_members on public.attachments
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

revoke all on public.attachments from anon;
grant all on public.attachments to authenticated;

-- ---------------------------------------------------------------------
-- The storage bucket the actual files live in. Private — nothing here
-- is reachable without being signed in and an active member, same rule
-- as every table in this database.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('task-attachments', 'task-attachments', false)
on conflict (id) do nothing;

drop policy if exists task_attachments_select on storage.objects;
create policy task_attachments_select on storage.objects
  for select to authenticated
  using (bucket_id = 'task-attachments' and public.is_active_member());

drop policy if exists task_attachments_insert on storage.objects;
create policy task_attachments_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'task-attachments' and public.is_active_member());

drop policy if exists task_attachments_delete on storage.objects;
create policy task_attachments_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'task-attachments' and public.is_active_member());
