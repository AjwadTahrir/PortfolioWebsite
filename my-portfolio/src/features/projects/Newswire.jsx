import { NEWSWIRE } from "../../data/newswire";
import "./Newswire.css";

/* Scrolling ticker of micro-headlines. Hover pauses it; clicking a headline
   jumps to the project's tile and opens its story. The list is rendered
   twice for a seamless loop — the copy is hidden from assistive tech. */
export default function Newswire({ onOpenProject }) {
  const openStory = (projectId) => {
    onOpenProject(projectId);
    document.getElementById(projectId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="newswire">
      <div className="newswire__track mono">
        {[false, true].map((isCopy) =>
          NEWSWIRE.map(({ headline, projectId }) => (
            <button
              key={`${isCopy ? "copy" : "main"}-${headline}`}
              className="newswire__item"
              onClick={() => openStory(projectId)}
              tabIndex={isCopy ? -1 : 0}
              aria-hidden={isCopy || undefined}
            >
              {headline}
              <span className="newswire__sep" aria-hidden="true">+++</span>
            </button>
          ))
        )}
      </div>
      <div className="newswire__hint mono" aria-hidden="true">CLICK A HEADLINE TO READ THE STORY ↓</div>
    </div>
  );
}
