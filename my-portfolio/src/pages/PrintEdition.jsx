import { useState } from "react";
import { SITE } from "../constants/site";
import useProjectsData from "../hooks/cms/useProjectsData";
import useReportsData from "../hooks/cms/useReportsData";
import useToday from "../hooks/useToday";
import { formatIssueDate } from "../utils/format";
import "./PrintEdition.css";

/* One-sheet "print edition": optional cover image, then every project and
   the field reports in two newspaper columns. Built for window.print(). */
export default function PrintEdition({ onClose }) {
  const today = useToday();
  const [hasCover, setHasCover] = useState(true);
  const { projects } = useProjectsData();
  const { reports } = useReportsData();

  return (
    <div className="print-edition">
      <div className="print-edition__toolbar">
        <button className="print-edition__back" onClick={onClose}>← BACK TO WEB EDITION</button>
        <button className="print-edition__print" onClick={() => window.print()}>PRINT / SAVE PDF ⎙</button>
      </div>

      {/* Cover page: drop your composed cover at /public/cover.PNG */}
      {hasCover && (
        <div className="print-sheet print-sheet--cover">
          <img
            className="print-sheet__cover-img"
            src="/cover.PNG"
            alt="AJWAD — The Software Engineer Issue, Vol. 01 cover"
            onError={() => setHasCover(false)}
          />
        </div>
      )}

      <div className="print-sheet">
        <div className="print-sheet__meta mono">
          <span>PRINT EDITION</span>
          <span>{formatIssueDate(today)}</span>
        </div>
        <div className="print-sheet__rule-thick print-sheet__rule-thick--top" />
        <h1 className="print-sheet__title">{SITE.name}</h1>
        <div className="print-sheet__subtitle mono">
          SOFTWARE ENGINEERING · UNIVERSITI MALAYA · FULL-STACK & ML · {SITE.githubLabel}
        </div>
        <div className="print-sheet__rule" />

        <div className="print-sheet__columns">
          {projects.map((project) => (
            <article key={project.id} className="print-article">
              <div className="print-article__kicker mono">{project.kicker}</div>
              <h3 className="print-article__name">{project.name}</h3>
              <p className="print-article__summary">{project.tech} {project.impact}</p>
              <div className="print-article__meta mono">{project.stack.join(" · ")} — {project.year}</div>
            </article>
          ))}
          <div className="print-article">
            <div className="print-article__kicker mono">FIELD REPORTS</div>
            {reports.map(({ id, title, outcomes }) => (
              <div key={id} className="print-report">
                <b className="print-report__title">{title}</b>
                {outcomes.map((outcome) => <div key={outcome} className="print-report__outcome">✓ {outcome}</div>)}
              </div>
            ))}
          </div>
        </div>

        <div className="print-sheet__footer mono">
          <span>CONTACT: {SITE.email}</span>
          <span>© {today.getFullYear()} {SITE.name}</span>
        </div>
      </div>
    </div>
  );
}
