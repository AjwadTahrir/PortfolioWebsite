# AJWAD — The Software Engineer Issue

Portfolio site styled as a print magazine. React 19 + Vite, no router, no
state library. Projects, archive tiles, and reports/stats are editable
live at `/admin` (Supabase-backed); everything else is plain JS data in
the repo.

## Setup

```bash
npm install
```

### 1. Create the Supabase backend (one-time)

1. Create a free project at [supabase.com](https://supabase.com).
2. Project → SQL Editor → New query → paste `../supabase/schema.sql` → Run.
   This creates the four content tables and locks writes to signed-in users only.
3. Storage → New bucket → name it exactly `screenshots` → toggle **Public bucket** on → Create.
   Then SQL Editor → New query → paste `../supabase/storage.sql` → Run, to lock uploads
   the same way (anyone can view, only you can add/replace/delete).
4. Authentication → Users → Add user → create your own admin login (email + password).
   Check **Auto Confirm User** or the account won't be able to sign in. There's no public
   signup screen — this is the only account that will ever exist.
5. Project Settings → API → copy the Project URL and the two keys (anon + service_role).
6. `cp .env.example .env.local` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
   from step 5. Also add `SUPABASE_URL` (same URL) and `SUPABASE_SERVICE_ROLE_KEY`
   (the service key — used only by the seed script below, never by the browser).

### 2. Load the existing content

```bash
npm run seed
```

Inserts the site's current projects, archive tiles, reports and stats into
Supabase. Safe to re-run — it upserts rather than duplicating.

### 3. Run it

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run lint     # oxlint
```

Visit `/admin` and sign in with the account from step 3 above to edit content.
Edits appear on the public pages immediately — no rebuild needed.

## Where things live

```text
src/
├── main.jsx, App.jsx   entry; App switches between the web/print editions and /admin
├── pages/               WebEdition (the site) and PrintEdition (printable sheet)
├── admin/                the /admin app: login, tabs, and one editor per CMS table
├── features/
│   ├── projects/         cover story, newswire ticker, feature grid, project overlay
│   └── archive/          "The Life Issue" bento grid + its overlays (map, run log)
├── components/
│   ├── layout/           masthead, navbar, section breaks, page folio
│   ├── sections/         one component (+ CSS) per magazine page
│   └── ui/                Overlay, Reveal, Typewriter, Figure, shared tile/status styles
├── hooks/
│   ├── cms/               useProjectsData, useArchiveData, useReportsData, useStatsData
│   │                       — fetch from Supabase, with realtime sync
│   └── (site hooks)       useInView, useActiveSection, useProjectRoute, useToday
├── lib/supabase.js        the Supabase client (reads VITE_SUPABASE_* env vars)
├── data/                   content NOT in the CMS: navigation, eras, newswire, runs, skills, travels
├── constants/              site identity/contact (site.js), palette for SVG (colors.js)
├── utils/                  small formatters
└── styles/                 tokens.css (design tokens) and base.css (globals, primitives)

supabase/
└── schema.sql              run once in the Supabase SQL editor

my-portfolio/scripts/
└── seed.js                 run once locally (npm run seed) to load starting content
```

Each component imports its own CSS file, so styles sit next to the markup
they belong to. Colours, fonts and shared values are CSS custom properties in
`styles/tokens.css`.

## What's editable where

**Through `/admin`** (Supabase-backed, edits go live immediately):
- **Projects** — the cover story, feature grid and engineering notes.
- **Archive tiles** — "The Life Issue" bento grid.
- **Reports & Stats** — "By the numbers" and "Field Reports".

**In the repo** (rare changes, a code edit + redeploy):
- **Nav items:** `src/data/navigation.js` (ids must match section ids).
- **Chronicles / Blueprint / Stack Index:** `src/data/eras.js`, `BlueprintSection.jsx`, `src/data/skills.js`.
- **Newswire headlines:** `src/data/newswire.js` (each links to a project id).
- **Name, email or links:** `src/constants/site.js`.
- **Colours or fonts:** `src/styles/tokens.css` (and `constants/colors.js` for SVG).

## Adding a project or archive tile through /admin

- **Project visuals upload straight from the form** — each screenshot field
  has an "Upload image" button that stores the file in Supabase Storage and
  fills in its URL automatically. No code push or redeploy needed. (The
  original nine projects' screenshots still live as plain files in
  `public/screenshots/` from before this existed — those keep working
  exactly as before, and you can leave them there or replace them with an
  upload at any time.)
- **A new archive tile needs a CSS grid position.** The bento grid layout is
  keyed to tile ids in `features/archive/archive.css`'s `grid-template-areas`.
  Editing one of the five existing tiles (`travel`, `university`, `running`,
  `photography`, `life`) through `/admin` works immediately; adding a sixth
  tile saves fine but needs a matching grid-area added to that CSS file
  before it's positioned on the page.

## Deploying

Project stories have their own URLs (`/projects/<id>`), and so does `/admin`.
The host must serve `index.html` for unknown paths (SPA fallback) or deep
links and `/admin` will 404 on refresh.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables
on your host (Vercel/Netlify project settings) — same values as `.env.local`.
Never set `SUPABASE_SERVICE_ROLE_KEY` there; it's only for the local seed script.
