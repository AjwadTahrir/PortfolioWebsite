-- Portfolio PDF: optional per-project fields read by the "Download portfolio" PDF.
-- Run once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every step is guarded.
--
-- IMPORTANT: run this BEFORE filling in role, demo or image in /admin, or
-- those saves will fail with "column ... does not exist". Until then the site
-- and the PDF keep working: the PDF shows [role] and skips demo and image.

alter table projects add column if not exists role  text;  -- your role on the project, e.g. "Team lead, ML pipeline"
alter table projects add column if not exists demo  text;  -- live demo URL
alter table projects add column if not exists image text;  -- PNG/JPG URL shown in the PDF
