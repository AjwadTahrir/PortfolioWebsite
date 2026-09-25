/* The issue in reading order. `id` must match a section's DOM id; the
   page number is the position in this list, so a page added here is
   numbered everywhere (folio, running head, Contents) without touching
   anything else. */
export const PAGES = [
  { id: "cover", title: "The cover", blurb: "Volume 01, Kuala Lumpur" },
  { id: "author", title: "The profile", blurb: "Who is behind this issue, and what they do off-screen" },
  { id: "editors-letter", title: "From the editor", blurb: "Why these stories" },
  { id: "features", title: "The work", blurb: "Things I have built, one line each" },
  { id: "log", title: "The chronicles", blurb: "Four years, newest first" },
  { id: "blueprint", title: "The blueprint", blurb: "How the stack layers" },
  { id: "reports", title: "Field reports", blurb: "Outcomes, verified" },
  { id: "index", title: "The stack index", blurb: "Every tool, and where it appears" },
  { id: "letters", title: "Letters to the editor", blurb: "Get in touch" },
].map((page, i) => ({ ...page, no: String(i + 1).padStart(2, "0") }));

/* Sections that share another page's number: the archive follows the profile
   and is part of that page. */
const SAME_PAGE_AS = { archive: "author" };

/* Every id the folio and running head should watch for. */
export const PAGE_IDS = [...PAGES.map((page) => page.id), ...Object.keys(SAME_PAGE_AS)];
export const PAGE_COUNT = PAGES.length;

export function pageOf(id) {
  const pageId = SAME_PAGE_AS[id] ?? id;
  return PAGES.find((page) => page.id === pageId);
}
