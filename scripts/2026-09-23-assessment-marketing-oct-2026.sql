-- Olive Clinical — Team workspace
-- One-off content seed: the "Assessment Marketing — Oct 2026" punch list,
-- added as a new marketing project with a single section and 12 tasks.
--
-- This is NOT a schema migration — it doesn't belong in the numbered
-- supabase/migrations chain, since it seeds one specific list rather than
-- something every environment needs. Run it once, by hand, in Supabase →
-- SQL Editor → New query → paste this whole file → Run.
--
-- Safe to run more than once: the project, its section, and every task is
-- only inserted if a row with that exact name doesn't already exist, so
-- re-running (or pasting it in twice by accident) never creates
-- duplicates. The final step (assigning the tasks) always
-- re-applies too.
--
-- Assumes active members named something containing "madrone" and
-- "jonatan" (case insensitive) already exist. If either isn't found, or
-- more than one matches, this raises a clear error instead of guessing —
-- edit the two `ilike` patterns a few lines down to match the exact
-- names and run it again.
--
-- "Red" on the source punch list is Madrone; the freelancer named there
-- is Jonatan. Task 6 ("Red or freelancer") goes to Jonatan; everything
-- else goes to Madrone.
--
-- Task 11 repeats monthly. Where migration 0007 has been applied, it
-- carries recurrence_rule 'monthly' so completing it spawns the next
-- month's copy. Where that migration hasn't run yet, the tasks.recurrence_rule
-- column doesn't exist, so the script inserts without it and says
-- "then monthly" in the task's description instead — the list still
-- seeds correctly, the repeat just isn't automatic.
--
-- Marketing/ops tracking only — no client names, no PHI, no assessment
-- content. See README.md.

do $$
declare
  v_project_id uuid;
  v_section_id uuid;
  v_madrone_id    uuid;
  v_madrone_count int;
  v_jonatan_id    uuid;
  v_jonatan_count int;
  v_has_recurrence boolean;
begin
  -- 1. Find Madrone ("Red" on the punch list).
  select count(*) into v_madrone_count
  from public.profiles
  where archived_at is null and name ilike '%madrone%';

  if v_madrone_count = 0 then
    raise exception 'No active team member with "madrone" in their name was found. Check the exact name in Olive Team, then edit the ilike pattern near the top of this script to match it.';
  elsif v_madrone_count > 1 then
    raise exception 'More than one active member matches "madrone" — edit the ilike pattern near the top of this script to be more specific, then run it again.';
  end if;

  select id into v_madrone_id
  from public.profiles
  where archived_at is null and name ilike '%madrone%';

  -- 1b. Find Jonatan (the freelancer).
  select count(*) into v_jonatan_count
  from public.profiles
  where archived_at is null and name ilike '%jonatan%';

  if v_jonatan_count = 0 then
    raise exception 'No active team member with "jonatan" in their name was found. Check the exact name in Olive Team, then edit the ilike pattern near the top of this script to match it.';
  elsif v_jonatan_count > 1 then
    raise exception 'More than one active member matches "jonatan" — edit the ilike pattern near the top of this script to be more specific, then run it again.';
  end if;

  select id into v_jonatan_id
  from public.profiles
  where archived_at is null and name ilike '%jonatan%';

  -- 2. The project.
  select id into v_project_id
  from public.projects
  where archived_at is null and name = 'Assessment Marketing — Oct 2026';

  if v_project_id is null then
    insert into public.projects (name, description, type, status, owner_id, due_date, default_view)
    values (
      'Assessment Marketing — Oct 2026',
      'Punch list for the assessment marketing push. Goal: 4 booked assessments in October.',
      'marketing',
      'on_track',
      v_madrone_id,
      date '2026-11-01',
      'list'
    )
    returning id into v_project_id;
  end if;

  -- 3. One section — the punch list itself, in doc order.
  select id into v_section_id
  from public.sections
  where project_id = v_project_id and name = 'Punch list' and archived_at is null;

  if v_section_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Punch list', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_section_id;
  end if;

  -- 4. Tasks — skipping any title that already exists in this section.
  --    completed stays false: everything starts as not started.
  --
  --    The task rows are the same either way; only whether the monthly
  --    repeat on task 11 is stored as a recurrence rule or as a note
  --    depends on whether migration 0007 has been applied here.
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'tasks' and column_name = 'recurrence_rule'
  ) into v_has_recurrence;

  create temporary table tmp_punch_list (
    ord             int,
    title           text,
    description     text,
    due_date        date,
    recurrence_rule text
  ) on commit drop;

  insert into tmp_punch_list (ord, title, description, due_date, recurrence_rule)
  values
    (1,  'Update assessment page pricing to $2,400 / $3,200', 'New copy is in Olive_Clinical_Marketing_Punch_List.docx, section 2.', date '2026-09-26', null),
    (2,  'Build referrer list: 30 names (therapists, psychiatrists, college counseling, ND coaches)', null, date '2026-09-30', null),
    (3,  'Send 10 referrer emails per week, weeks of Sep 28, Oct 5, Oct 12', 'Two email versions (therapists/coaches, psychiatrists/prescribers) plus follow-up are in the same doc, section 3.', date '2026-10-16', null),
    (4,  'Meet Alex Klein: referral pipeline plus one joint webinar', null, date '2026-09-24', null),
    (5,  'Create Psychology Today listing for Olive Clinical assessments', 'Listing copy is in the same doc, section 5.', date '2026-09-30', null),
    (6,  'Set up Google Ads account, one campaign, $40/day', 'Full campaign spec (keywords, negatives, headlines, descriptions, landing page requirements) is in the same doc, section 6.', date '2026-10-03', null),
    (7,  'Add tracking: "How did you hear about us" on intake form, one dropdown', null, date '2026-10-03', null),
    (8,  'Give contractor the content calendar and blog posts to cut into carousels', 'Four-week content calendar is in the same doc, section 7.', date '2026-09-30', null),
    (9,  'Book and complete 4 assessments', null, date '2026-10-31', null),
    (10, 'Get CPA quote for professional corporation conversion', null, date '2026-10-31', null),
    (11, 'Review inquiries by source, cost per booked assessment', null, date '2026-11-01', 'monthly'),
    (12, 'Tell Sati your end date', null, date '2026-09-30', null);

  if v_has_recurrence then
    execute $ins$
      insert into public.tasks (project_id, section_id, title, description, due_date, recurrence_rule, position)
      select $1, $2, v.title, v.description, v.due_date, v.recurrence_rule,
             coalesce((select max(position) from public.tasks where section_id = $2), 0) + v.ord * 1024
      from tmp_punch_list v
      where not exists (select 1 from public.tasks t where t.section_id = $2 and t.title = v.title)
    $ins$ using v_project_id, v_section_id;
  else
    -- No recurrence column here: keep the repeat visible in the text.
    update tmp_punch_list
    set description = trim(both ' ' from coalesce(description || ' ', '') || 'Due Nov 1, then monthly.')
    where recurrence_rule is not null;

    insert into public.tasks (project_id, section_id, title, description, due_date, position)
    select v_project_id, v_section_id, v.title, v.description, v.due_date,
           coalesce((select max(position) from public.tasks where section_id = v_section_id), 0) + v.ord * 1024
    from tmp_punch_list v
    where not exists (select 1 from public.tasks t where t.section_id = v_section_id and t.title = v.title);
  end if;

  -- 5. Assign: Madrone owns the list, Jonatan owns the Google Ads setup.
  update public.tasks
  set assignee_id = v_madrone_id
  where section_id = v_section_id
    and archived_at is null;

  update public.tasks
  set assignee_id = v_jonatan_id
  where section_id = v_section_id
    and archived_at is null
    and title = 'Set up Google Ads account, one campaign, $40/day';

end $$;
