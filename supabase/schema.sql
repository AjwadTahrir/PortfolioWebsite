-- Provenance/portfolio CMS schema.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

-- ---------------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id            text primary key,        -- slug, e.g. "saltellite" — used in URLs
  no            text not null,            -- page number shown in the magazine, e.g. "01"
  importance    text not null check (importance in ('cover', 'feature', 'note')),
  kicker        text not null,
  name          text not null,
  dek           text not null,
  problem       text not null,
  tech          text not null,
  impact        text not null,
  pull          text not null,
  stack         text[] not null default '{}',
  link          text,
  year          text not null,
  decisions     jsonb not null default '[]',   -- [{ title, body }]
  visuals       jsonb not null default '[]',   -- [{ no, caption, type, ...type-specific fields }]
  cover_story   jsonb,                          -- only set on the one "cover" project
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ARCHIVE ITEMS ("The Life Issue" bento tiles)
-- ---------------------------------------------------------------------------
create table if not exists archive_items (
  id            text primary key,   -- also used as the CSS grid-area name — keep it stable
  kicker        text not null,
  title         text not null,
  dek           text not null,
  placeholder   text,               -- shown instead of a dedicated overlay component, if set
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- REPORTS (Field Reports section)
-- ---------------------------------------------------------------------------
create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  title         text not null unique,   -- lets the seed script upsert by title instead of duplicating rows
  outcomes      text[] not null default '{}',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- STATS ("By the numbers" section)
-- ---------------------------------------------------------------------------
create table if not exists stats (
  id            uuid primary key default gen_random_uuid(),
  value         text not null,   -- e.g. "50+"
  label         text not null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (value, label)          -- lets the seed script upsert instead of duplicating rows
);

-- ---------------------------------------------------------------------------
-- updated_at trigger (all four tables)
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger archive_items_set_updated_at before update on archive_items
  for each row execute function set_updated_at();
create trigger reports_set_updated_at before update on reports
  for each row execute function set_updated_at();
create trigger stats_set_updated_at before update on stats
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security: anyone can read, only a signed-in user can write.
-- There is no public signup — you create your one admin account by hand in
-- Supabase Auth, so "authenticated" always means you.
-- ---------------------------------------------------------------------------
alter table projects enable row level security;
alter table archive_items enable row level security;
alter table reports enable row level security;
alter table stats enable row level security;

create policy "public read" on projects for select using (true);
create policy "admin write" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read" on archive_items for select using (true);
create policy "admin write" on archive_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read" on reports for select using (true);
create policy "admin write" on reports for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read" on stats for select using (true);
create policy "admin write" on stats for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
