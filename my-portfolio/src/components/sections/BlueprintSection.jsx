import EditorialSection from "../layout/EditorialSection";
import "./BlueprintSection.css";

/* The stack drawn as a narrowing tower; `inset` sets how far each layer steps in. */
const LAYERS = [
  { name: "PRODUCT LAYER", tech: "React · Flutter", inset: "0px" },
  { name: "API LAYER", tech: "FastAPI · Express · Node.js", inset: "6%" },
  { name: "DATA LAYER", tech: "MongoDB · Firebase", inset: "12%" },
  { name: "INTELLIGENCE LAYER", tech: "scikit-learn · Sentinel-2 · LLM APIs", inset: "18%" },
];

/* How individual projects cut through the four layers ("—" = layer unused). */
const PROJECT_SLICES = [
  { project: "SALTellite", slice: "React → FastAPI → — → GB model + LLM" },
  { project: "FitTrack", slice: "JS → Express → MongoDB → —" },
];

export default function BlueprintSection() {
  return (
    <EditorialSection id="blueprint" no="04" kicker="THE ENGINEERING BLUEPRINT" breakLabel="THE ENGINEERING BLUEPRINT" title="How the stack layers" className="blueprint">
      <div className="spread-grid blueprint__grid">
        <div>
          <p className="body-p blueprint__intro">
            Every system in this issue is a slice through the same four layers.
            A React dashboard or a Flutter app at the surface; FastAPI or Express
            routing beneath it; MongoDB or Firebase holding state; and at the bottom,
            the intelligence — ML models and satellite data doing the actual thinking.
          </p>
          <p className="body-p blueprint__aside">
            The stack narrows as it deepens: many interfaces, fewer APIs, one source
            of truth, and a single intelligence layer that makes the product worth building.
          </p>
          <div className="blueprint__slices">
            {PROJECT_SLICES.map(({ project, slice }) => (
              <div key={project} className="blueprint__slice">
                <span className="blueprint__slice-name">{project}</span>
                <span className="blueprint__slice-path mono">{slice}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {LAYERS.map(({ name, tech, inset }) => (
            <div key={name} className="blueprint__layer" style={{ marginInline: inset }}>
              <span className="blueprint__layer-name mono">{name}</span>
              <span className="blueprint__layer-tech">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
