/* Curation for The Work. Matching is case-insensitive on the project id.

   WORK_ORDER: the order projects appear in within their group (cover story,
   features, notes). An id listed here with no matching project is skipped, so
   "lepak" and "cropwatch" slot into place the moment they exist in the
   database; a project not listed simply sorts after the listed ones.

   TAGLINES: one short line per project, specific about the problem or the
   outcome. Drafts from each project's description, to be edited. When the
   `projects` table gets a tagline column, read it there and drop this map;
   until then a project without an entry falls back to the first clause of
   its description. */
export const WORK_ORDER = [
  "saltellite",
  "provenance",
  "lepak",
  "cropwatch",
  "fittrack",
  "pethealth",
  "bizbuddy",
  "doctelemy",
  "marz-tamam-db",
];

export const TAGLINES = {
  saltellite: "Satellite intelligence for coastal farmland.",
  provenance: "Verifiable credit history for underserved MSMEs.",
  lepak: "A discovery-first way to find places worth going.",
  cropwatch: "Satellite and IoT monitoring for healthier crops.",
  fittrack: "Nutrition planning for a team fitness app, end to end.",
  pethealth: "Fifty requirements for digital veterinary records.",
  bizbuddy: "A WhatsApp assistant that scores micro-business credit.",
  doctelemy: "Offline-first AI triage for rural clinics.",
  "marz-tamam-db": "Inventory and booking for a real business, in Oracle APEX.",
  foodies: "Community food sharing, with live maps.",
  "alzheimers-iot": "Safety and health monitoring for Alzheimer's patients.",
};

export function taglineOf(project) {
  const drafted = TAGLINES[project.id.toLowerCase()];
  if (drafted) return drafted;
  const firstClause = project.dek.split(/ [—–] /)[0].replace(/\.$/, "");
  return `${firstClause}.`;
}

/* Position in WORK_ORDER; projects not listed sort after the listed ones. */
function rankOf(project) {
  const i = WORK_ORDER.indexOf(project.id.toLowerCase());
  return i === -1 ? WORK_ORDER.length : i;
}

/* The Work, split by each project's importance label in the database:
   the cover story (first), the features (an opener panel each), and the
   notes (a bento grid). Each group follows WORK_ORDER, then data order. */
export function workGroups(projects) {
  const byRank = (a, b) => rankOf(a) - rankOf(b);
  const withLabel = (label) => projects.filter((p) => p.importance === label).sort(byRank);
  const [cover, ...extraCovers] = withLabel("cover");
  return {
    cover,
    features: [...extraCovers, ...withLabel("feature")],
    notes: withLabel("note"),
  };
}

/* The stack items worth showing beside the category: the first `count` that
   do not just repeat it ("Requirements" under a "Requirements" category). */
export function techOf(project, count = 2) {
  const category = categoryOf(project).toLowerCase();
  return project.stack.filter((item) => item.toLowerCase() !== category).slice(0, count);
}

/* "FEATURE STORY · AI × REMOTE SENSING" -> "AI × REMOTE SENSING" */
export function categoryOf(project) {
  const parts = project.kicker.split(" · ");
  return parts[parts.length - 1];
}
