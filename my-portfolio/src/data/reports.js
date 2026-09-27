/* Fallback evidence for the Field reports ledger. A report's year and related
   project now live on the report itself (`year`, `project_id` in /admin). This
   map, keyed by event title (case-insensitive), only fills in until the
   database migration has been run, and can be deleted afterwards. */
export const REPORT_META = {
  "shortcut asia challenge 2026": { year: "2026", project: "saltellite" },
  "borneohack 2026": { year: "2026", project: "bizbuddy" },
  "kitahack & umhackathon": { year: "2026", project: "doctelemy" },
  "software engineering project": { year: "2026", project: "pethealth" },
  "research project": { year: "2026", project: "pethealth" },
};

/* A report's own `year` and `project_id` (edited in /admin) win; the map above
   only fills in for reports the database has nothing for yet. */
export function metaOf(report) {
  const fallback = REPORT_META[report.title.toLowerCase()] ?? {};
  return {
    year: report.year || fallback.year,
    project: (report.project_id || fallback.project || "").toLowerCase() || undefined,
  };
}

/* Groups entries by year, newest first. Undated entries follow in a group of
   their own. Headings are only worth showing when there is more than one dated
   year, so callers check `groups.filter((g) => g.year).length > 1`. */
export function groupByYear(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry.year ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : b.localeCompare(a)))
    .map(([year, items]) => ({ year, items }));
}
