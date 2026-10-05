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
-- Each task carries the matching asset from the punch list doc in its
-- description — the pricing block, both outreach emails and the
-- follow-up, the Alex Klein agenda and follow-up email, the Psychology
-- Today listing copy, the full Google Ads brief, the four-week content
-- calendar, and the tracking sheet columns — so the workspace holds the
-- whole thing rather than pointing at a file. Descriptions are the same
-- tiptap HTML the task editor produces (p/strong/em/ul/ol/li/br only,
-- per lib/team/sanitize-html.ts).
--
-- Task 11 repeats monthly. Where migration 0007 has been applied, it
-- carries recurrence_rule 'monthly' so completing it spawns the next
-- month's copy. Where that migration hasn't run yet, the
-- tasks.recurrence_rule column doesn't exist, so the script inserts
-- without it; task 11's description opens with "Due Nov 1, then
-- monthly." either way, so the repeat stays visible.
--
-- Marketing and operations content only — no client names and no PHI.
-- See README.md.

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
    (1, $t$Update assessment page pricing to $2,400 / $3,200$t$, $t$<p><strong>Drop-in copy for the pricing section of the assessment page. Replaces the $1,200 / $1,600 block.</strong></p><p><strong>Fees</strong></p><ul><li>Single assessment (autism or ADHD): $2,400</li><li>Combined assessment (autism and ADHD): $3,200</li></ul><p>Every assessment includes a comprehensive written report, a feedback session to walk through the findings together, and a strengths-based accommodation letter if you want one. There are no add-on fees for the report.</p><p>Payment: half at booking, half before the feedback session. We are private pay. A superbill is available on request if you'd like to submit for out-of-network reimbursement.</p><p>Sliding scale: a limited number of reduced-fee assessments are available each quarter. Ask when you inquire.</p><p>Why these numbers: at your $250 rate, a single eval is 7 to 9 hours of your time. $2,400 is the low end of what that costs. Bay Area adult ASD/ADHD evaluations currently run $2,500 to $5,000. You are still the affordable option.</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 2.</p>$t$, date '2026-09-26', null),
    (2, $t$Build referrer list: 30 names (therapists, psychiatrists, college counseling, ND coaches)$t$, $t$<p><strong>Who goes on the list of 30</strong></p><ul><li>Therapists in Oakland, Berkeley, and SF who list ADHD, autism, or neurodivergence on Psychology Today (10 to 12 names)</li><li>Psychiatrists and psychiatric NPs who prescribe stimulants and want a formal diagnosis on file (6 to 8 names)</li><li>College counseling centers and disability services: UC Berkeley, SF State, Mills/Northeastern, CCA, CIIS student services (4 to 5 contacts)</li><li>ADHD and executive function coaches in the East Bay (3 to 4 names)</li><li>People who already know you: former CIIS colleagues in practice, your consultation group, the multiracial clinician directory (5 or more)</li></ul><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 3.</p>$t$, date '2026-09-30', null),
    (3, $t$Send 10 referrer emails per week, weeks of Sep 28, Oct 5, Oct 12$t$, $t$<p>Send from madrone@madronelove.com or your Olive Clinical address, one recipient at a time, first name in the greeting. No mail merge. Ten per week.</p><p><strong>Version A: therapists and coaches</strong></p><p>Subject: Adult autism and ADHD assessment referrals, 3-week wait</p><p>Hi [First name],</p><p>I'm Madrone Love, a licensed psychologist in Oakland. I've opened an adult autism and ADHD assessment practice under Olive Clinical and I'm reaching out to a small number of clinicians whose clients might need one.</p><p>What I offer that's hard to find locally: assessments built for high-masking adults, including women, people of color, and people who were told they "couldn't be autistic" earlier in life. Every assessment includes a full written report, a feedback session, and an accommodation letter. Current wait is about three weeks. Fees are $2,400 for a single assessment and $3,200 for combined autism and ADHD, with superbills for out-of-network reimbursement.</p><p>If it would be useful, I'm happy to do a 20-minute call to walk through what the report looks like and how I handle the referral back to you. No pressure either way; mostly I want you to know this exists.</p><p>Warmly,<br>Madrone Love, PsyD<br>Olive Clinical | oliveclinical.com | PSY35899</p><p><strong>Version B: psychiatrists and prescribers</strong></p><p>Subject: Formal ADHD and autism evaluations for your adult patients</p><p>Dr. [Last name],</p><p>I'm a licensed psychologist in Oakland offering formal adult ADHD and autism spectrum evaluations under Olive Clinical. I'm writing because prescribers often need a documented diagnostic evaluation on file and the wait at larger centers is running months.</p><p>My evaluations use structured clinical interview plus validated measures (DIVA-5, ASRS, CAARS, AQ-50, RAADS-R, CAT-Q, collateral report where available) and produce a full written report with DSM-5-TR criteria addressed individually. I address differential diagnosis directly, including trauma, OCD, and anxiety presentations that mimic ADHD. Current wait is about three weeks. I send the signed report to you with the patient's consent within one week of the feedback session.</p><p>Fees are $2,400 single and $3,200 combined, private pay with superbill. I'd welcome a brief call if you'd like to see a sample report.</p><p>Best,<br>Madrone Love, PsyD<br>Olive Clinical | oliveclinical.com | PSY35899</p><p><strong>Follow-up (send 10 days later if no reply)</strong></p><p>Hi [First name], quick follow-up in case this got buried. Adult autism and ADHD assessments, three-week wait, full report included. Happy to send a sample report if that's useful. Madrone</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 3.</p>$t$, date '2026-10-16', null),
    (4, $t$Meet Alex Klein: referral pipeline plus one joint webinar$t$, $t$<p>Thursday 11am at Sirene.</p><p><strong>What you want out of it</strong></p><ul><li>A standing referral arrangement: his PDA and autism overflow comes to you, your PDA-heavy cases can go to him for consult. No fees exchanged for referrals.</li><li>One recorded webinar together in Q1 2027, "Assessing PDA and Autism in Adults," gated by email signup on oliveclinical.com. The email list seeds the Institute.</li><li>Not on the table this meeting: co-ownership, a joint practice, or him as Institute faculty. Those can come later once referrals are flowing.</li></ul><p><strong>Talking points</strong></p><ul><li>Lead with what you have: the assessment page, the report format, the three-week wait. Show him a sample report on your phone if you have one.</li><li>Ask what happens to people he can't take. Where do they go now? That's your slot.</li><li>Ask what he charges and what his wait is. You want your price and wait within range of his so referrals feel natural.</li><li>Propose the webinar as a 60-minute Zoom, split evenly, recorded, each of you promotes to your own list. Date in January or February.</li></ul><p><strong>Follow-up email, send Thursday afternoon</strong></p><p>Subject: Thanks, and two next steps</p><p>Alex, thanks for the time today. Two things to put in writing so they happen:</p><ol><li>Referrals. I'm taking adult autism and ADHD assessments now, three-week wait, $2,400 single and $3,200 combined, full report included. Send anyone you can't take to assessment@oliveclinical.com and I'll confirm receipt within a day. I'll do the same for PDA-heavy consults in your direction.</li><li>Webinar. "Assessing PDA and Autism in Adults," 60 minutes on Zoom, recorded. I'll host and handle registration. Does a Thursday in late January work? Send me two or three dates and I'll build the signup page.</li></ol><p>Warmly, Madrone</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 4.</p>$t$, date '2026-09-24', null),
    (5, $t$Create Psychology Today listing for Olive Clinical assessments$t$, $t$<p>Create a second listing under Olive Clinical, category Psychological Testing and Evaluation, separate from your therapy profile. First 300 characters show in search results.</p><p><strong>Opening statement</strong></p><p>Adult autism and ADHD assessments for people who have spent years masking, wondering, and being told they don't "look" neurodivergent. I evaluate adults of all genders and backgrounds, with particular attention to late-identified women, people of color, and high-achieving professionals whose struggles have been invisible to others. Three-week wait. Every assessment includes a full written report, a feedback session, and an accommodation letter.</p><p><strong>Second paragraph</strong></p><p>My assessments combine a structured clinical interview with validated measures and, where possible, input from someone who knows you well. I address differential diagnosis directly, including trauma, OCD, and anxiety, so the answer you get is the right one. Reports are written in plain language for you first and clinical language for anyone who needs it second.</p><p><strong>Third paragraph</strong></p><p>I'm a licensed clinical psychologist with training from UC Berkeley, the Wright Institute, and UCSF, and I taught clinical psychology at CIIS for years. I am neurodivergent-affirming in practice, not just in language. Private pay with superbills for out-of-network reimbursement. Telehealth throughout California.</p><p>Specialties to check: Autism, ADHD, Testing and Evaluation. Issues: Women's Issues, Racial Identity, OCD, Trauma. Do not check 30 boxes; six focused ones rank better.</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 5.</p>$t$, date '2026-09-30', null),
    (6, $t$Set up Google Ads account, one campaign, $40/day$t$, $t$<p>One search campaign, Bay Area only, $40/day to start ($1,200/month). Two ad groups. Landing page for both is the assessment page with the new pricing. If you hand this to a freelancer, this is the brief.</p><p><strong>Settings</strong></p><ul><li>Campaign type: Search only. Turn off Display Network and Search Partners.</li><li>Location: Alameda, Contra Costa, San Francisco, Marin, San Mateo counties. Target "presence," not "interest."</li><li>Bidding: Maximize clicks for the first 30 days, then switch to Maximize conversions once 15 or more form submissions are tracked.</li><li>Schedule: all days, 6am to midnight.</li><li>Conversion action: inquiry form submission on the assessment page. Set this up before spending a dollar.</li></ul><p><strong>Ad group 1: Autism assessment — keywords (phrase match)</strong></p><p>"adult autism assessment", "autism assessment adults", "autism testing adults", "autism evaluation adults", "adult autism diagnosis", "am I autistic test adult", "autism assessment oakland", "autism assessment bay area", "autism assessment san francisco", "PDA assessment adults"</p><p><strong>Ad group 2: ADHD assessment — keywords (phrase match)</strong></p><p>"adult ADHD assessment", "ADHD testing adults", "ADHD evaluation adults", "adult ADHD diagnosis", "ADHD assessment oakland", "ADHD assessment bay area", "ADHD psychologist oakland", "ADHD and autism assessment"</p><p><strong>Negative keywords (both groups)</strong></p><p>free, child, children, kids, pediatric, toddler, school, free test, online quiz, quiz, medicaid, medi-cal, kaiser, jobs, salary, training, certification, course, school psychologist</p><p><strong>Responsive search ad, ad group 1 (autism) — headlines, 30 characters max, use all 15</strong></p><ul><li>Adult Autism Assessment (23)</li><li>Oakland Autism Evaluation (25)</li><li>Late-Identified? Get Answers (28)</li><li>Three-Week Wait, Not Months (27)</li><li>Full Written Report Included (28)</li><li>Built for High-Masking Adults (29)</li><li>Licensed Psychologist, Oakland (30)</li><li>Telehealth Across California (28)</li><li>Autism and ADHD, One Assessment (31)</li><li>Neurodivergent-Affirming (24)</li><li>Clear Fees, No Surprises (24)</li><li>Accommodation Letter Included (29)</li><li>Assessment for Adult Women (26)</li><li>Book a Free 15-Min Consult (26)</li><li>Olive Clinical Assessments (26)</li></ul><p><strong>Descriptions, 90 characters max</strong></p><ul><li>Adult autism assessments by a licensed psychologist. Report, feedback session, and letter included. (99)</li><li>Three-week wait. $2,400 single, $3,200 combined with ADHD. Superbills for insurance reimbursement. (98)</li><li>Designed for adults who have masked for years. Plain-language report you can actually use. (90)</li><li>Telehealth throughout California. Book a free 15-minute consult to see if assessment fits. (90)</li></ul><p><strong>Responsive search ad, ad group 2 (ADHD) — headlines</strong></p><ul><li>Adult ADHD Assessment (21)</li><li>Oakland ADHD Evaluation (23)</li><li>Formal ADHD Diagnosis, Adults (29)</li><li>Three-Week Wait, Not Months (27)</li><li>Full Written Report Included (28)</li><li>Licensed Psychologist, Oakland (30)</li><li>ADHD or Something Else? (23)</li><li>ADHD and Autism, One Assessment (31)</li><li>Documentation for Your Doctor (29)</li><li>Telehealth Across California (28)</li><li>Clear Fees, No Surprises (24)</li><li>Neurodivergent-Affirming (24)</li><li>Accommodation Letter Included (29)</li><li>Book a Free 15-Min Consult (26)</li><li>Olive Clinical Assessments (26)</li></ul><p><strong>Descriptions</strong></p><ul><li>Formal adult ADHD evaluations with a full report your prescriber can use. Three-week wait. (90)</li><li>$2,400 single assessment, $3,200 with autism. Superbills provided for out-of-network reimbursement. (99)</li><li>Structured interview plus validated measures. We rule out what looks like ADHD but isn't. (89)</li><li>Telehealth across California. Free 15-minute consult to see if assessment is the right step. (92)</li></ul><p><strong>Landing page requirements</strong></p><ul><li>Price visible without scrolling on mobile.</li><li>One button: "Book a free 15-minute consult." Links to a scheduler, not a contact form.</li><li>"How did you hear about us" dropdown on the consult booking form.</li><li>Load time under 3 seconds on phone. Google penalizes slow pages with higher costs per click.</li></ul><p><strong>What good looks like after 30 days</strong></p><ul><li>Click-through rate above 5%. Below 3% means the headlines are off.</li><li>Cost per click $4 to $9.</li><li>Cost per booked assessment under $400. Above that, fix the landing page before adding budget.</li></ul><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 6.</p>$t$, date '2026-10-03', null),
    (7, $t$Add tracking: "How did you hear about us" on intake form, one dropdown$t$, $t$<p>The dropdown feeds the tracking sheet, so its options have to match the sheet's Source column exactly: Google Ads, Psychology Today, Referrer name, Instagram, Alex, Other.</p><p>The Google Ads brief also requires this dropdown on the consult booking form, and the conversion action depends on it being in place before any ad spend.</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, sections 6 and 8.</p>$t$, date '2026-10-03', null),
    (8, $t$Give contractor the content calendar and blog posts to cut into carousels$t$, $t$<p>Everything here is repurposed from writing you've already done. His job is cutting, designing, and scheduling, not writing. Instagram and LinkedIn, three posts a week. Brand colors, no stock photos, no arrows, no em dashes.</p><p><strong>Week 1</strong></p><ul><li>Mon — Carousel: "Windows of interest" blog post cut into 6 slides</li><li>Wed — Text post: "Time is a rainbow," one paragraph pulled from the post, link in bio</li><li>Fri — Announcement: Olive Clinical now offers adult autism and ADHD assessments, three-week wait</li></ul><p><strong>Week 2</strong></p><ul><li>Mon — Carousel: 5 signs an adult was missed for autism (from your assessment page copy)</li><li>Wed — Text post: what a good assessment report includes and why the report is never an add-on</li><li>Fri — Quote card: one line from the emotional orphanhood post</li></ul><p><strong>Week 3</strong></p><ul><li>Mon — Carousel: ADHD or trauma or OCD? Why differential diagnosis matters (from your I-CBT work)</li><li>Wed — Text post: "What I ask in an assessment" with 4 sample questions</li><li>Fri — Reel or slide: what to expect in a feedback session, 30 seconds, you on camera or captions only</li></ul><p><strong>Week 4</strong></p><ul><li>Mon — Carousel: masking, from the CAT-Q framing, what compensation and assimilation look like day to day</li><li>Wed — Text post: fees and why superbills, plain explanation of out-of-network reimbursement</li><li>Fri — Announcement: webinar with Dr. Alex Klein coming in January, join the list</li></ul><p>Hashtags: keep to 5. #AdultAutism #ADHDAdults #LateDiagnosed #Neurodivergent #BayAreaTherapist. LinkedIn gets the same content with a clinician framing and no hashtags.</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 7.</p>$t$, date '2026-09-30', null),
    (9, $t$Book and complete 4 assessments$t$, null, date '2026-10-31', null),
    (10, $t$Get CPA quote for professional corporation conversion$t$, null, date '2026-10-31', null),
    (11, $t$Review inquiries by source, cost per booked assessment$t$, $t$<p>Due Nov 1, then monthly.</p><p><strong>The sheet</strong></p><p>One Google Sheet, updated weekly. Columns: Date | Name or initials | Source (Google Ads, Psychology Today, Referrer name, Instagram, Alex, Other) | Consult booked Y/N | Assessment booked Y/N | Type (single/combined) | Fee | Completed date</p><p><strong>Monthly review, first of the month, four numbers only</strong></p><ul><li>Inquiries by source</li><li>Booked assessments by source</li><li>Ad spend divided by booked assessments from ads</li><li>Dollars saved this month</li></ul><p>No client names in the sheet if it lives outside SimplePractice. Initials and dates only.</p><p>Source: Olive_Clinical_Marketing_Punch_List.docx, section 8.</p>$t$, date '2026-11-01', $t$monthly$t$),
    (12, $t$Tell Sati your end date$t$, null, date '2026-09-30', null);

  if v_has_recurrence then
    execute $ins$
      insert into public.tasks (project_id, section_id, title, description, due_date, recurrence_rule, position)
      select $1, $2, v.title, v.description, v.due_date, v.recurrence_rule,
             coalesce((select max(position) from public.tasks where section_id = $2), 0) + v.ord * 1024
      from tmp_punch_list v
      where not exists (select 1 from public.tasks t where t.section_id = $2 and t.title = v.title)
    $ins$ using v_project_id, v_section_id;
  else
    -- No recurrence column here. Task 11's description already opens with
    -- "Due Nov 1, then monthly.", so the repeat stays visible either way
    -- and there is nothing to append.
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
