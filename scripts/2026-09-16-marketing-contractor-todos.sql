-- Olive Clinical — Team workspace
-- One-off content seed: the "Marketing Contractor: First 30 Days" checklist,
-- added as sections and tasks inside the existing Social Media Marketing
-- Plan project.
--
-- This is NOT a schema migration — it doesn't belong in the numbered
-- supabase/migrations chain, since it targets one specific, already-existing
-- project rather than something every environment needs. Run it once, by
-- hand, in Supabase → SQL Editor → New query → paste this whole file → Run.
--
-- Safe to run more than once: every section and every task is only
-- inserted if a row with that exact name doesn't already exist in this
-- project, so re-running (or pasting it in twice by accident) never
-- creates duplicates. The final step (assigning everything to Jonatan)
-- always re-applies too, so running this again after Jonatan is renamed
-- or reassigned will just put it back.
--
-- Assumes a project named something containing "social media" (case
-- insensitive) already exists and is not archived, and a member named
-- something containing "jonatan" already exists and is active. If
-- either isn't found, or more than one matches, this raises a clear
-- error instead of guessing — edit the two `ilike` patterns a few lines
-- down to match your exact names and run it again.
--
-- All 46 tasks are assigned to Jonatan by assigning everything in the
-- six sections this script owns (Before day one, Week 1-4, Month two
-- and beyond) — simpler than repeating all 46 titles, and correct as
-- long as those section names are unique to this checklist within the
-- project, which they are unless you already had same-named sections
-- with unrelated tasks in them before running this.

do $$
declare
  v_project_id   uuid;
  v_match_count  int;
  v_jonatan_id   uuid;
  v_jonatan_count int;
  v_before_id    uuid;
  v_week1_id     uuid;
  v_week2_id     uuid;
  v_week3_id     uuid;
  v_week4_id     uuid;
  v_month2_id    uuid;
begin
  -- 1. Find the target project.
  select count(*) into v_match_count
  from public.projects
  where archived_at is null and name ilike '%social media%';

  if v_match_count = 0 then
    raise exception 'No active project with "social media" in its name was found. Check the exact project name in Olive Team, then edit the ilike pattern near the top of this script to match it.';
  elsif v_match_count > 1 then
    raise exception 'More than one active project matches "social media" — edit the ilike pattern near the top of this script to be more specific, then run it again.';
  end if;

  select id into v_project_id
  from public.projects
  where archived_at is null and name ilike '%social media%';

  -- 1b. Find Jonatan.
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

  -- 2. Sections — one per phase of the plan, appended after whatever
  --    sections the project already has.
  select id into v_before_id from public.sections where project_id = v_project_id and name = 'Before day one' and archived_at is null;
  if v_before_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Before day one', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_before_id;
  end if;

  select id into v_week1_id from public.sections where project_id = v_project_id and name = 'Week 1: Learn the practice and the rules' and archived_at is null;
  if v_week1_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Week 1: Learn the practice and the rules', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_week1_id;
  end if;

  select id into v_week2_id from public.sections where project_id = v_project_id and name = 'Week 2: Audit and plan' and archived_at is null;
  if v_week2_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Week 2: Audit and plan', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_week2_id;
  end if;

  select id into v_week3_id from public.sections where project_id = v_project_id and name = 'Week 3: First production' and archived_at is null;
  if v_week3_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Week 3: First production', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_week3_id;
  end if;

  select id into v_week4_id from public.sections where project_id = v_project_id and name = 'Week 4: Publish and measure' and archived_at is null;
  if v_week4_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Week 4: Publish and measure', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_week4_id;
  end if;

  select id into v_month2_id from public.sections where project_id = v_project_id and name = 'Month two and beyond' and archived_at is null;
  if v_month2_id is null then
    insert into public.sections (project_id, name, position)
    values (v_project_id, 'Month two and beyond', coalesce((select max(position) from public.sections where project_id = v_project_id), 0) + 1024)
    returning id into v_month2_id;
  end if;

  -- 3. Tasks — one insert per section, skipping any title that already
  --     exists in that section.

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_before_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_before_id), 0) + row_number() over () * 1024
  from (values
    ('Sign the Independent Contractor Agreement, Exhibit A, and Exhibit B', null),
    ('Collect a signed W-9 before the first payment', null),
    ('Create an Olive Clinical email address for them', 'Do not let them use a personal address on practice accounts.'),
    ('Set up a password manager with a shared vault for practice accounts only', '1Password or Bitwarden.'),
    ('Add them as a user or editor on each social account', 'Never as owner or primary admin.'),
    ('Create a shared drive folder: Brand, Drafts, Approved, Published, Reports, Assets', null),
    ('Confirm they have no access to SimplePractice, the clinical inbox, voicemail, or billing', null),
    ('Put the standing weekly hour on both calendars, recurring', null),
    ('Save their phone number, and tell them yours is for crisis escalations only', null),
    ('Establish a Psychology Today profile for Olive Clinical', null),
    ('Make sure bios say the same thing in the same voice across platforms', null)
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_before_id and t.title = v.title);

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_week1_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_week1_id), 0) + row_number() over () * 1024
  from (values
    ('Log in to the password manager, set a strong master password, enable two-factor', null),
    ('Log in to each social account and enable two-factor on each', null),
    ('Confirm their device has a password, encryption, and automatic screen lock', null),
    ('Get access to the shared drive folder', null),
    ('Read Exhibit B twice', 'Ask about anything unclear.'),
    ('Read five Olive Clinical blog posts', null),
    ('Read the Psychology Today profile and the website About and Services pages', null),
    ('Look at three or four other neurodiversity-affirming or OCD-focused assessment practices online', 'Note what feels honest and what feels like marketing.'),
    ('Write the Week 1 one-pager', 'In their own words, no jargon: who this practice helps and what they''re usually dealing with; what makes this practice different from a generic therapy practice; three things we must never post, and why; what is still confusing.')
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_week1_id and t.title = v.title);

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_week2_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_week2_id), 0) + row_number() over () * 1024
  from (values
    ('Audit every public profile for accuracy', 'Locations, services, and specialties current, including the new assessment service.'),
    ('Check that every link works and points to the right page', null),
    ('Check profile and cover images are current and correctly sized', null),
    ('Confirm contact paths lead to the website contact form, not DMs', null),
    ('Flag any old DBA names still visible', 'Neuroinclusive Therapy Center, Loquat, AuDHD Center.'),
    ('Inventory existing content that can be reused', 'Blog posts, talks, handouts, headshots, office photos — most of month two is repurposing this, not writing new material.'),
    ('Draft a four-week content calendar', 'Three posts a week: one educational post from existing blog content, one practice/personality post, one resource or reshare. Show date, platform, format, hook, and which existing asset it comes from — no finished copy yet.')
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_week2_id and t.title = v.title);

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_week3_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_week3_id), 0) + row_number() over () * 1024
  from (values
    ('Apply the approved profile fixes from the Week 2 audit', null),
    ('Produce six posts from approved calendar slots', 'Copy, graphic or clip, hashtags, alt text.'),
    ('Put all six posts in the Drafts folder', 'At least two business days before the meeting.'),
    ('Set up the scheduling tool and connect the accounts', null),
    ('Build a simple metrics sheet', 'Date, platform, post, reach, engagement, link clicks.'),
    ('Add alt text to every image', 'An accessibility baseline, and it matters more than usual for this audience.'),
    ('Verify every clinical claim has a source actually read', null),
    ('Write captions at a plain reading level', 'No clinical jargon without a plain-language gloss.'),
    ('License every stock asset, font, and audio track for commercial use', 'Record the license in the Assets folder.')
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_week3_id and t.title = v.title);

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_week4_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_week4_id), 0) + row_number() over () * 1024
  from (values
    ('Schedule and publish the approved queue', null),
    ('Run daily comment and message triage', 'Using the Exhibit B rules and response bank.'),
    ('Draft the next four weeks of the calendar', null),
    ('Produce the first monthly report', 'What published, what performed, what they would change.'),
    ('Submit the first invoice', 'Itemized by date, task, and hours.')
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_week4_id and t.title = v.title);

  insert into public.tasks (project_id, section_id, title, description, position)
  select v_project_id, v_month2_id, v.title, v.description::text,
         coalesce((select max(position) from public.tasks where section_id = v_month2_id), 0) + row_number() over () * 1024
  from (values
    ('Raise posting cadence only after four consistent weeks', null),
    ('Add one channel at a time', 'Do not launch a newsletter and short-form video in the same month.'),
    ('Schedule the 90-day rate review', 'Per Section 3.7 of the Agreement.'),
    ('Revisit the approval workflow at 90 days', 'Categories that never get revised can move to standing pre-approval.'),
    ('Hold off on referral-source marketing until the basics are steady', 'Likely the highest yield for the assessment service, but only once the basics are steady.')
  ) as v(title, description)
  where not exists (select 1 from public.tasks t where t.section_id = v_month2_id and t.title = v.title);

  -- 4. Assign everything above to Jonatan.
  update public.tasks
  set assignee_id = v_jonatan_id
  where section_id in (v_before_id, v_week1_id, v_week2_id, v_week3_id, v_week4_id, v_month2_id)
    and archived_at is null;

end $$;
