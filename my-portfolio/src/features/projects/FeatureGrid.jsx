import { padNumber } from "../../utils/format";
import FeatureTile from "./FeatureTile";

/* The Editor's Layout Engine.
   Each project's `importance` places it in a magazine section, and the
   section decides how its tiles look. Add projects as data; never touch
   layout. Empty sections are skipped. */
const SECTIONS = [
  { importance: "cover", label: "COVER STORY", showVisual: true, showDek: true, stackLimit: 3 },
  { importance: "feature", label: "FEATURE STORIES", showVisual: true, showDek: true, stackLimit: 3 },
  { importance: "note", label: "ENGINEERING NOTES", showVisual: false, showDek: false, stackLimit: 4 },
];

const FALLBACK_IMPORTANCE = "note"; // unknown/missing importance still gets shown

function sectionOf(project) {
  const known = SECTIONS.some((section) => section.importance === project.importance);
  return known ? project.importance : FALLBACK_IMPORTANCE;
}

export default function FeatureGrid({ projects, onOpen }) {
  return (
    <div>
      {SECTIONS.map((section) => {
        const sectionProjects = projects.filter((project) => sectionOf(project) === section.importance);
        if (!sectionProjects.length) return null;
        return (
          <div key={section.importance} className="feature-section">
            <div className="feature-section__head">
              <span className="feature-section__label mono">{section.label}</span>
              <span className="feature-section__rule" />
              <span className="feature-section__count mono">{padNumber(sectionProjects.length)}</span>
            </div>
            <div className={`feature-grid feature-grid--${section.importance}`}>
              {sectionProjects.map((project) => (
                <FeatureTile key={project.id} project={project} section={section} onOpen={onOpen} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
