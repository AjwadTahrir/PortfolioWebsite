import Overlay from "../../components/ui/Overlay";
import { FOLIO, SITE } from "../../constants/site";
import ProjectArticle from "./ProjectArticle";
import "./projects.css";

/* A project's full story, opened over the page. Closing goes through
   `onClose` (the route hook), so the Back button closes it too. */
export default function ProjectOverlay({ project, onClose }) {
  return (
    <Overlay label={`${project.name} — feature`} onClose={onClose}>
      {(requestClose) => (
        <>
          <div className="overlay__bar">
            <span className="story__bar-label mono">{SITE.issue} · PAGE {project.no}</span>
            <button className="overlay__close" onClick={requestClose} aria-label="Close">CLOSE ✕</button>
          </div>
          <div className="overlay__head">
            <div className="kicker">{project.kicker}</div>
            <h2 className="headline story__title">{project.name}</h2>
            <p className="story__subhead">{project.dek}</p>
            <div className="rule-thick story__head-rule" />
          </div>
          <ProjectArticle project={project} />
          <div className="story__foot mono">
            <span>{FOLIO}</span>
            <button className="overlay__close" onClick={requestClose}>← BACK TO CONTENTS</button>
          </div>
        </>
      )}
    </Overlay>
  );
}
