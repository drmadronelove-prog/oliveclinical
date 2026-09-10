-- Olive Clinical — Team workspace
-- Migration 0009: "due tomorrow" reminders (Phase 5)
--
-- Unlike everything else notification-related, nothing happens to
-- trigger this — it's not a reaction to an edit, it's a daily check.
-- That needs a scheduled job (pg_cron), not a trigger.

create extension if not exists pg_cron;

create or replace function public.notify_due_soon()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, task_id)
  select t.assignee_id, 'due_soon', t.id
  from public.tasks t
  where t.due_date = current_date + interval '1 day'
    and t.completed = false
    and t.archived_at is null
    and t.assignee_id is not null
    -- Never send the same task's reminder twice in one day, in case
    -- this job is ever triggered more than once.
    and not exists (
      select 1 from public.notifications n
      where n.task_id = t.id
        and n.type = 'due_soon'
        and n.created_at::date = current_date
    );
end;
$$;

-- Runs once daily. 8am UTC is midnight–1am Pacific depending on daylight
-- saving — a reminder that's waiting the next time anyone actually opens
-- the app, not one that arrives mid-workday. Change the schedule below
-- if a different time suits the team better; cron time is always UTC.
do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'notify-due-soon';
exception
  when others then null; -- nothing scheduled yet on a first run — fine
end $$;

select cron.schedule('notify-due-soon', '0 8 * * *', $$select public.notify_due_soon()$$);
