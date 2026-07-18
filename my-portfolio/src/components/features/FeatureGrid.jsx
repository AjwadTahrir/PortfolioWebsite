import React from "react";
import FeatureTile from "./FeatureTile";

/* ---- The Editor's Layout Engine ----
   Projects carry an `importance`; the engine maps that to a magazine
   section + tile variant. Add projects as data, never touch layout.
   Empty sections are skipped, so nothing ever renders half-populated. */
const SECTIONS = [
  { importance: "cover",   label: "COVER STORY",       variant: "cover",   gridClass: "feat-grid--cover" },
  { importance: "feature", label: "FEATURE STORIES",   variant: "feature", gridClass: "feat-grid--features" },
  { importance: "note",    label: "ENGINEERING NOTES", variant: "note",    gridClass: "feat-grid--notes" },
];

// Fallback so a project with a missing/unknown importance still appears.
function bucketOf(p) {
  return SECTIONS.some((s) => s.importance === p.importance) ? p.importance : "note";
}

export default function FeatureGrid({ projects, onOpen }) {
  return (
    <div>
      {SECTIONS.map((section) => {
        const items = projects.filter((p) => bucketOf(p) === section.importance);
        if (!items.length) return null;
        return (
          <div key={section.importance} className="feat-section">
            <div className="feat-section__head">
              <span className="feat-section__label mono">{section.label}</span>
              <span className="feat-section__rule" />
              <span className="feat-section__count mono">{String(items.length).padStart(2, "0")}</span>
            </div>
            <div className={`feat-grid ${section.gridClass}`}>
              {items.map((p) => (
                <FeatureTile
                  key={p.id}
                  p={p}
                  variant={section.variant}
                  label={p.kicker}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
