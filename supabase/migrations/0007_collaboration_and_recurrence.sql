-- Olive Clinical — Team workspace
-- Migration 0007: comments, notifications, activity log, recurring tasks
-- (Phase 5)

-- ---------------------------------------------------------------------
-- 1. Comments
-- ---------------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references public.tasks (id) on delete cascade,
  author_id   uuid not null references public.profiles (id),
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists comments_task_idx on public.comments (task_id, created_at);

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at
  before update on public.comments
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 2. Notifications — the Inbox
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  type         text not null check (type in ('assignment', 'mention', 'comment', 'due_soon')),
  task_id      uuid references public.tasks (id) on delete cascade,
  actor_id     uuid references public.profiles (id),
  comment_id   uuid references public.comments (id) on delete cascade,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists notifications_recipient_idx
  on public.notifications (recipient_id, created_at desc);

-- ---------------------------------------------------------------------
-- 3. Activity log — append-only, filled in by a trigger rather than
--    application code, so it cannot be missed by one code path
--    forgetting to log something. Every task-editing surface in this
--    app (list, board, My Tasks, the detail pane) ends up as a plain
--    UPDATE on this table, so one trigger covers all of them at once.
-- ---------------------------------------------------------------------
create table if not exists public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks (id) on delete cascade,
  actor_id   uuid references public.profiles (id),
  field      text not null,
  old_value  text,
  new_value  text,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_task_idx on public.activity_log (task_id, created_at);

create or replace function public.log_task_activity()
returns trigger
language plpgsql
as $$
begin
  if new.title is distinct from old.title then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'title', old.title, new.title);
  end if;
  if new.assignee_id is distinct from old.assignee_id then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'assignee', old.assignee_id::text, new.assignee_id::text);
  end if;
  if new.due_date is distinct from old.due_date then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'due_date', old.due_date::text, new.due_date::text);
  end if;
  if new.priority is distinct from old.priority then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'priority', old.priority, new.priority);
  end if;
  if new.completed is distinct from old.completed then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'completed', old.completed::text, new.completed::text);
  end if;
  if new.section_id is distinct from old.section_id then
    insert into public.activity_log (task_id, actor_id, field, old_value, new_value)
    values (new.id, auth.uid(), 'section', old.section_id::text, new.section_id::text);
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_log_activity on public.tasks;
create trigger tasks_log_activity
  after update on public.tasks
  for each row execute function public.log_task_activity();

-- ---------------------------------------------------------------------
-- 4. Assignment notifications — trigger-based for the same reason as
--    the activity log: whether a task gets assigned by editing it
--    directly or by bulk-creation (instantiating an onboarding
--    template), this fires either way.
-- ---------------------------------------------------------------------
create or replace function public.notify_on_assignment()
returns trigger
language plpgsql
as $$
begin
  if new.assignee_id is null then
    return new;
  end if;
  if tg_op = 'UPDATE' and new.assignee_id is not distinct from old.assignee_id then
    return new;
  end if;
  if new.assignee_id = auth.uid() then
    return new; -- no need to notify yourself
  end if;

  insert into public.notifications (recipient_id, type, task_id, actor_id)
  values (new.assignee_id, 'assignment', new.id, auth.uid());
  return new;
end;
$$;

drop trigger if exists tasks_notify_assignment_insert on public.tasks;
create trigger tasks_notify_assignment_insert
  after insert on public.tasks
  for each row execute function public.notify_on_assignment();

drop trigger if exists tasks_notify_assignment_update on public.tasks;
create trigger tasks_notify_assignment_update
  after update of assignee_id on public.tasks
  for each row execute function public.notify_on_assignment();

-- ---------------------------------------------------------------------
-- 5. Comment notifications — the task's assignee always hears about a
--    new comment (the "task follower" this app has, automatically,
--    rather than a manual follow button). The comment's own author
--    never notifies themselves.
-- ---------------------------------------------------------------------
create or replace function public.notify_on_comment()
returns trigger
language plpgsql
as $$
declare
  v_assignee_id uuid;
begin
  select assignee_id into v_assignee_id from public.tasks where id = new.task_id;

  if v_assignee_id is not null and v_assignee_id != new.author_id then
    insert into public.notifications (recipient_id, type, task_id, actor_id, comment_id)
    values (v_assignee_id, 'comment', new.task_id, new.author_id, new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists comments_notify on public.comments;
create trigger comments_notify
  after insert on public.comments
  for each row execute function public.notify_on_comment();

-- ---------------------------------------------------------------------
-- 6. Recurring tasks — completing one with a recurrence rule spawns the
--    next instance. Trigger-based for the same "cannot be missed"
--    reason as everything above: the checkbox that completes a task
--    lives in four different places in this app.
-- ---------------------------------------------------------------------
alter table public.tasks
  add column if not exists recurrence_rule text
    check (recurrence_rule in ('weekly', 'biweekly', 'monthly', 'quarterly'));
alter table public.tasks
  add column if not exists recurrence_parent_id uuid references public.tasks (id);

comment on column public.tasks.recurrence_rule is
  'Set by hand on any task. When a task with this set is marked complete, the next instance is created automatically with the due date advanced by this rule.';

create or replace function public.spawn_recurring_task()
returns trigger
language plpgsql
as $$
declare
  v_next_due date;
begin
  if new.recurrence_rule is null or new.due_date is null then
    return new;
  end if;

  v_next_due := case new.recurrence_rule
    when 'weekly'    then (new.due_date + interval '7 days')::date
    when 'biweekly'  then (new.due_date + interval '14 days')::date
    when 'monthly'   then (new.due_date + interval '1 month')::date
    when 'quarterly' then (new.due_date + interval '3 months')::date
  end;

  insert into public.tasks (
    project_id, section_id, title, description, assignee_id,
    due_date, priority, position, recurrence_rule, recurrence_parent_id
  ) values (
    new.project_id, new.section_id, new.title, new.description, new.assignee_id,
    v_next_due, new.priority, new.position, new.recurrence_rule,
    coalesce(new.recurrence_parent_id, new.id)
  );

  return new;
end;
$$;

drop trigger if exists tasks_spawn_recurring on public.tasks;
create trigger tasks_spawn_recurring
  after update of completed on public.tasks
  for each row
  when (old.completed is distinct from new.completed and new.completed = true)
  execute function public.spawn_recurring_task();

-- ---------------------------------------------------------------------
-- 7. Row-level security — same rule as every table so far: any active
--    member reads and writes freely. activity_log is the one exception:
--    read-only from the app's side, since it only exists as a record of
--    what a trigger already did.
-- ---------------------------------------------------------------------
alter table public.comments      enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_log  enable row level security;

drop policy if exists comments_all_members on public.comments;
create policy comments_all_members on public.comments
  for all to authenticated
  using (public.is_active_member())
  with check (public.is_active_member());

-- Notifications: everyone can see who a notification is about (needed so
-- the trigger inserts succeed regardless of who's logged in when a
-- notification is generated), but only the recipient can mark their own
-- as read, and nobody deletes another person's inbox.
drop policy if exists notifications_select_members on public.notifications;
create policy notifications_select_members on public.notifications
  for select to authenticated
  using (public.is_active_member());

drop policy if exists notifications_insert_members on public.notifications;
create policy notifications_insert_members on public.notifications
  for insert to authenticated
  with check (public.is_active_member());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

drop policy if exists activity_log_select_members on public.activity_log;
create policy activity_log_select_members on public.activity_log
  for select to authenticated
  using (public.is_active_member());

drop policy if exists activity_log_insert_members on public.activity_log;
create policy activity_log_insert_members on public.activity_log
  for insert to authenticated
  with check (public.is_active_member());

revoke all on public.comments      from anon;
revoke all on public.notifications from anon;
revoke all on public.activity_log  from anon;
grant all on public.comments      to authenticated;
grant all on public.notifications to authenticated;
grant select, insert on public.activity_log to authenticated;
