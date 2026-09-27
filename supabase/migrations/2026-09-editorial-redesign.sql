-- Editorial redesign: fields the site now reads from the database instead of code.
-- Run once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every step is guarded.
--
-- IMPORTANT: run this BEFORE saving anything in /admin that uses the new
-- fields (tagline, year, related project, photos), or those saves will fail
-- with "column ... does not exist". Until then the site keeps working: it
-- falls back to the drafts in data/work.js and data/reports.js.

-- ---------------------------------------------------------------------------
-- PROJECTS: a one-line tagline shown in The Work
-- ---------------------------------------------------------------------------
alter table projects add column if not exists tagline text;

update projects set tagline = 'Satellite intelligence for coastal farmland.'              where lower(id) = 'saltellite'     and tagline is null;
update projects set tagline = 'Verifiable credit history for underserved MSMEs.'          where lower(id) = 'provenance'     and tagline is null;
update projects set tagline = 'Nutrition planning for a team fitness app, end to end.'    where lower(id) = 'fittrack'       and tagline is null;
update projects set tagline = 'Fifty requirements for digital veterinary records.'        where lower(id) = 'pethealth'      and tagline is null;
update projects set tagline = 'A WhatsApp assistant that scores micro-business credit.'   where lower(id) = 'bizbuddy'       and tagline is null;
update projects set tagline = 'Offline-first AI triage for rural clinics.'                where lower(id) = 'doctelemy'      and tagline is null;
update projects set tagline = 'Inventory and booking for a real business, in Oracle APEX.' where lower(id) = 'marz-tamam-db' and tagline is null;
update projects set tagline = 'Community food sharing, with live maps.'                   where lower(id) = 'foodies'        and tagline is null;
update projects set tagline = 'Safety and health monitoring for Alzheimer''s patients.'   where lower(id) = 'alzheimers-iot' and tagline is null;

-- The Work is ordered by sort_order (the admin's "Sort order"), so set it once
-- to the order you asked for. Ids not listed (lepak, cropwatch) are added
-- later with their own sort_order.
update projects set sort_order = 1  where lower(id) = 'saltellite';
update projects set sort_order = 2  where lower(id) = 'provenance';
update projects set sort_order = 3  where lower(id) = 'lepak';
update projects set sort_order = 4  where lower(id) = 'cropwatch';
update projects set sort_order = 5  where lower(id) = 'fittrack';
update projects set sort_order = 6  where lower(id) = 'pethealth';
update projects set sort_order = 7  where lower(id) = 'bizbuddy';
update projects set sort_order = 8  where lower(id) = 'doctelemy';
update projects set sort_order = 9  where lower(id) = 'marz-tamam-db';
update projects set sort_order = 10 where lower(id) = 'foodies';
update projects set sort_order = 11 where lower(id) = 'alzheimers-iot';

-- ---------------------------------------------------------------------------
-- REPORTS: year and related project for the Field reports ledger
-- ---------------------------------------------------------------------------
alter table reports add column if not exists year text;
alter table reports add column if not exists project_id text;  -- a projects.id; not a foreign key, so a renamed project just drops the link

update reports set year = '2026', project_id = 'saltellite' where lower(title) = 'shortcut asia challenge 2026' and year is null;
update reports set year = '2026', project_id = 'bizbuddy'   where lower(title) = 'borneohack 2026'              and year is null;
update reports set year = '2026', project_id = 'doctelemy'  where lower(title) = 'kitahack & umhackathon'       and year is null;
update reports set year = '2026', project_id = 'pethealth'  where lower(title) = 'software engineering project' and year is null;
update reports set year = '2026', project_id = 'pethealth'  where lower(title) = 'research project'             and year is null;

-- ---------------------------------------------------------------------------
-- ARCHIVE ITEMS: a photo list for the Photography contact sheet
-- ---------------------------------------------------------------------------
alter table archive_items add column if not exists photos jsonb not null default '[]';  -- [{ src, caption }]
