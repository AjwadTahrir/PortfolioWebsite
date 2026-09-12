import "../../components/ui/tile.css";
import ProjectVisual from "./ProjectVisual";

/* One project in the features grid. The section config decides whether it
   shows a visual and dek, and how many stack items it lists. */
export default function FeatureTile({ project, section, onOpen }) {
  const leadVisual = section.showVisual ? project.visuals?.[0] : null;

  return (
    <button
      id={project.id}
      className={`tile feature-tile feature-tile--${section.importance}`}
      onClick={() => onOpen(project.id)}
    >
      {leadVisual && (
        <div className="feature-tile__visual">
          <ProjectVisual visual={leadVisual} />
        </div>
      )}
      <div className="tile__body">
        <div className="kicker tile__label">{project.kicker}</div>
        <h3 className="tile__name">{project.name}</h3>
        {section.showDek && <p className="tile__dek">{project.dek}</p>}
        <div className="feature-tile__foot">
          <div className="feature-tile__stack mono">{project.stack.slice(0, section.stackLimit).join(" · ")}</div>
          <div className="feature-tile__meta">
            <span className="feature-tile__year mono">{project.year}</span>
            <span className="feature-tile__cta mono">READ STORY ↗</span>
          </div>
        </div>
      </div>
    </button>
  );
}
