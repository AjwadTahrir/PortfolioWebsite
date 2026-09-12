/* "The Life Issue" bento tiles. Tile placement lives in archive.css
   (grid-template-areas keyed by id). Tiles without a dedicated content
   component (see ArchiveOverlay) show `placeholder` when opened. */
export const ARCHIVE = [
  {
    id: "travel",
    kicker: "TRAVEL",
    title: "Field Notes",
    dek: "Places I've been, roads I've taken, and wherever's next.",
  },
  {
    id: "university",
    kicker: "UNIVERSITY",
    title: "Campus Life",
    dek: "Universiti Malaya, Software Engineering — the parts that don't fit in a project card.",
    placeholder: "TODO — campus content",
  },
  {
    id: "running",
    kicker: "RUNNING",
    title: "The Log",
    dek: "21,000+ metres of questionable decisions across two half marathons.",
  },
  {
    id: "photography",
    kicker: "PHOTOGRAPHY",
    title: "Shots",
    dek: "TODO — a line about what you shoot.",
    placeholder: "TODO — photo grid",
  },
  {
    id: "life",
    kicker: "LIFE",
    title: "Off The Record",
    dek: "TODO — whatever else belongs here.",
    placeholder: "TODO — life content",
  },
];
