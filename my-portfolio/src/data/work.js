/* Curation for The Work. Projects are grouped by their importance label in
   the database (cover, feature, note) and ordered by their sort_order, both
   edited in /admin.

   TAGLINES: fallback one-liners, used only when a project's own `tagline`
   column is empty or does not exist yet (before the database migration has
   been run). Once the migration has filled the column these can be deleted.
   With no tagline anywhere, a project falls back to the first clause of its
   description. */
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
  if (project.tagline) return project.tagline;
  const drafted = TAGLINES[project.id.toLowerCase()];
  if (drafted) return drafted;
  const firstClause = project.dek.split(/ [—–] /)[0].replace(/\.$/, "");
  return `${firstClause}.`;
}

/* The Work, split by each project's importance label in the database: the
   cover story (first), the features (an opener panel each), and the notes
   (a bento grid). Each group follows sort_order. */
export function workGroups(projects) {
  const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const withLabel = (label) => projects.filter((p) => p.importance === label).sort(bySortOrder);
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
