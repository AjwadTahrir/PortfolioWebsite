/* Evidence for the Field reports ledger. The `reports` table holds the event
   title and its outcomes; it has no year or related project, so those live
   here, keyed by the event title (case-insensitive). Drafts inferred from the
   projects' own dates, to be checked. A report with no entry shows no year and
   no link. `project` is a project id whose story the row links to. */
export const REPORT_META = {
  "shortcut asia challenge 2026": { year: "2026", project: "saltellite" },
  "borneohack 2026": { year: "2026", project: "bizbuddy" },
  "kitahack & umhackathon": { year: "2026", project: "doctelemy" },
  "software engineering project": { year: "2026", project: "pethealth" },
  "research project": { year: "2026", project: "pethealth" },
};

export const metaOf = (title) => REPORT_META[title.toLowerCase()] ?? {};

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
