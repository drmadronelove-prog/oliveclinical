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
-- duplicates. The final step (assigning everything to Red) always
-- re-applies too.
--
-- Assumes a member named something containing "red" (case insensitive)
-- already exists and is active. If they aren't found, or more than one
-- matches, this raises a clear error instead of guessing — edit the
-- `ilike` pattern a few lines down to match the exact name and run it
-- again.
--
-- Task 6 is owned by "Red or freelancer" on the source punch list. A
-- freelancer isn't a workspace member, so the task is assigned to Red as
-- the default owner and can be reassigned by hand once a freelancer is
-- picked.
--
-- Task 11 repeats: it carries recurrence_rule 'monthly', so completing it
-- spawns the next month's copy (see migration 0007).
--
-- Marketing/ops tracking only — no client names, no PHI, no assessment
-- content. See README.md.

do $$
declare
  v_project_id uuid;
  v_section_id uuid;
  v_red_id     uuid;
  v_red_count  int;
begin
  -- 1. Find Red.
  select count(*) into v_red_count
  from public.profiles
  where archived_at is null and name ilike '%red%';

  if v_red_count = 0 then
    raise exception 'No active team member with "red" in their name was found. Check the exact name in Olive Team, then edit the ilike pattern near the top of this script to match it.';
  elsif v_red_count > 1 then
    raise exception 'More than one active member matches "red" — edit the ilike pattern near the top of this script to be more specific, then run it again.';
  end if;

  select id into v_red_id
  from public.profiles
  where archived_at is null and name ilike '%red%';

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
      v_red_id,
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
  insert into public.tasks (project_id, section_id, title, description, due_date, recurrence_rule, position)
  select v_project_id, v_section_id, v.title, v.description::text, v.due_date::date, v.recurrence_rule::text,
         coalesce((select max(position) from public.tasks where section_id = v_section_id), 0) + v.ord * 1024
  from (values
    (1,  'Update assessment page pricing to $2,400 / $3,200', 'New copy is in Olive_Clinical_Marketing_Punch_List.docx, section 2.', '2026-09-26', null),
    (2,  'Build referrer list: 30 names (therapists, psychiatrists, college counseling, ND coaches)', null, '2026-09-30', null),
    (3,  'Send 10 referrer emails per week, weeks of Sep 28, Oct 5, Oct 12', 'Two email versions (therapists/coaches, psychiatrists/prescribers) plus follow-up are in the same doc, section 3.', '2026-10-16', null),
    (4,  'Meet Alex Klein: referral pipeline plus one joint webinar', null, '2026-09-24', null),
    (5,  'Create Psychology Today listing for Olive Clinical assessments', 'Listing copy is in the same doc, section 5.', '2026-09-30', null),
    (6,  'Set up Google Ads account, one campaign, $40/day', 'Full campaign spec (keywords, negatives, headlines, descriptions, landing page requirements) is in the same doc, section 6.', '2026-10-03', null),
    (7,  'Add tracking: "How did you hear about us" on intake form, one dropdown', null, '2026-10-03', null),
    (8,  'Give contractor the content calendar and blog posts to cut into carousels', 'Four-week content calendar is in the same doc, section 7.', '2026-09-30', null),
    (9,  'Book and complete 4 assessments', null, '2026-10-31', null),
    (10, 'Get CPA quote for professional corporation conversion', null, '2026-10-31', null),
    (11, 'Review inquiries by source, cost per booked assessment', null, '2026-11-01', 'monthly'),
    (12, 'Tell Sati your end date', null, '2026-09-30', null)
  ) as v(ord, title, description, due_date, recurrence_rule)
  where not exists (select 1 from public.tasks t where t.section_id = v_section_id and t.title = v.title);

  -- 5. Assign everything above to Red.
  update public.tasks
  set assignee_id = v_red_id
  where section_id = v_section_id
    and archived_at is null;

end $$;
