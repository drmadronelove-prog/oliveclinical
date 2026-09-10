-- Olive Clinical — Team workspace
-- Migration 0003: add "assessment" as a project type

alter table public.projects drop constraint if exists projects_type_check;
alter table public.projects add constraint projects_type_check
  check (type in ('marketing', 'onboarding', 'assessment', 'general'));
