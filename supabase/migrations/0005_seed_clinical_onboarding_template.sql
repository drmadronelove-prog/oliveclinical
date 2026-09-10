-- Olive Clinical — Team workspace
-- Migration 0005: seed a realistic clinical-hire onboarding template
--
-- Safe to run more than once — it only inserts if this exact template
-- name doesn't already exist, so re-running the migration file (or
-- pasting it in twice by accident) never creates duplicates.

do $$
declare
  v_template_id uuid;
  v_prestart_id uuid;
  v_week1_id    uuid;
  v_30day_id    uuid;
  v_90day_id    uuid;
begin
  if exists (
    select 1 from public.project_templates
    where name = 'Clinical hire onboarding' and archived_at is null
  ) then
    return;
  end if;

  insert into public.project_templates (name, description)
  values (
    'Clinical hire onboarding',
    'The standard sequence for bringing on a new clinical team member — paperwork, credentialing, systems access, and the first 90 days.'
  )
  returning id into v_template_id;

  insert into public.template_sections (template_id, name, position)
  values (v_template_id, 'Pre-start', 1024) returning id into v_prestart_id;
  insert into public.template_sections (template_id, name, position)
  values (v_template_id, 'Week 1', 2048) returning id into v_week1_id;
  insert into public.template_sections (template_id, name, position)
  values (v_template_id, 'First 30 days', 3072) returning id into v_30day_id;
  insert into public.template_sections (template_id, name, position)
  values (v_template_id, 'First 90 days', 4096) returning id into v_90day_id;

  insert into public.template_tasks
    (template_id, template_section_id, title, offset_days, default_assignee_role, position)
  values
    -- Pre-start
    (v_template_id, v_prestart_id, 'Send offer letter', -21, 'Admin', 1024),
    (v_template_id, v_prestart_id, 'Countersign and file employment contract', -18, 'Admin', 2048),
    (v_template_id, v_prestart_id, 'Collect W-9 and employment paperwork', -14, 'Admin', 3072),
    (v_template_id, v_prestart_id, 'Verify state license is active and in good standing', -14, 'Supervisor', 4096),
    (v_template_id, v_prestart_id, 'Confirm malpractice insurance coverage', -14, 'Admin', 5120),
    (v_template_id, v_prestart_id, 'Request NPI number confirmation', -14, 'New hire', 6144),
    (v_template_id, v_prestart_id, 'Begin CAQH profile and attestation', -14, 'New hire', 7168),
    (v_template_id, v_prestart_id, 'Submit panel credentialing applications', -10, 'Admin', 8192),
    (v_template_id, v_prestart_id, 'Order EHR account provisioning', -7, 'IT', 9216),
    (v_template_id, v_prestart_id, 'Schedule EHR training session', -7, 'IT', 10240),
    (v_template_id, v_prestart_id, 'Set up work email address', -5, 'IT', 11264),
    (v_template_id, v_prestart_id, 'Set up calendar and scheduling access', -5, 'IT', 12288),
    (v_template_id, v_prestart_id, 'Confirm supervision schedule and supervisor assignment', -5, 'Supervisor', 13312),
    (v_template_id, v_prestart_id, 'Collect headshot and bio for the website', -5, 'New hire', 14336),
    (v_template_id, v_prestart_id, 'Draft website bio page', -3, 'Admin', 15360),
    (v_template_id, v_prestart_id, 'Prepare workstation and equipment', -3, 'Office Manager', 16384),
    (v_template_id, v_prestart_id, 'Add to office directory listing', -2, 'Admin', 17408),
    (v_template_id, v_prestart_id, 'Draft welcome and intro announcement', -2, 'Admin', 18432),

    -- Week 1
    (v_template_id, v_week1_id, 'Welcome and office tour', 0, 'Office Manager', 1024),
    (v_template_id, v_week1_id, 'Complete EHR training', 1, 'IT', 2048),
    (v_template_id, v_week1_id, 'Review supervision expectations; schedule first session', 1, 'Supervisor', 3072),
    (v_template_id, v_week1_id, 'Walk through client intake process', 2, 'Supervisor', 4096),
    (v_template_id, v_week1_id, 'Confirm email and calendar access are working', 2, 'IT', 5120),
    (v_template_id, v_week1_id, 'Publish website bio and directory listing', 3, 'Admin', 6144),
    (v_template_id, v_week1_id, 'Send intro announcement to team and referral sources', 3, 'Admin', 7168),
    (v_template_id, v_week1_id, 'Review credentialing application status', 5, 'Admin', 8192),
    (v_template_id, v_week1_id, 'Set up direct deposit and payroll', 5, 'Admin', 9216),
    (v_template_id, v_week1_id, 'Review data boundary and confidentiality policies', 5, 'Supervisor', 10240),
    (v_template_id, v_week1_id, 'First check-in with supervisor', 7, 'Supervisor', 11264),

    -- First 30 days
    (v_template_id, v_30day_id, 'Confirm NPI and CAQH fully processed', 14, 'Admin', 1024),
    (v_template_id, v_30day_id, 'Shadow a senior clinician session', 14, 'Supervisor', 2048),
    (v_template_id, v_30day_id, 'Follow up on outstanding panel credentialing applications', 21, 'Admin', 3072),
    (v_template_id, v_30day_id, 'Review caseload and scheduling expectations', 21, 'Supervisor', 4096),
    (v_template_id, v_30day_id, '30-day check-in', 30, 'Supervisor', 5120),

    -- First 90 days
    (v_template_id, v_90day_id, 'Confirm all credentialing and panels fully active', 60, 'Admin', 1024),
    (v_template_id, v_90day_id, '60-day check-in', 60, 'Supervisor', 2048),
    (v_template_id, v_90day_id, 'Review performance and integration feedback', 75, 'Supervisor', 3072),
    (v_template_id, v_90day_id, 'Confirm licensure renewal date is on file', 90, 'Admin', 4096),
    (v_template_id, v_90day_id, '90-day check-in and review', 90, 'Supervisor', 5120),
    (v_template_id, v_90day_id, 'Transition from onboarding checklist to standard workflow', 90, 'Supervisor', 6144);
end $$;
