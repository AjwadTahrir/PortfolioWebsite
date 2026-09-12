import Figure from "../../components/ui/Figure";
import ProjectVisual from "./ProjectVisual";

function ArticleBlock({ heading, children }) {
  return (
    <div>
      <h3 className="article__section-h">{heading}</h3>
      {children}
    </div>
  );
}

/* Body of a project story: figures, problem/technology, pull quote,
   decisions, result and stack. Purely presentational. */
export default function ProjectArticle({ project }) {
  const { visuals = [], decisions } = project;

  return (
    <div className="article">
      <div className="article__frames">
        {visuals.map((visual) => (
          <Figure key={visual.no} no={visual.no} caption={visual.caption}>
            <ProjectVisual visual={visual} />
          </Figure>
        ))}
      </div>

      <div className="spread-grid article__spread">
        <ArticleBlock heading="THE PROBLEM"><p className="body-p">{project.problem}</p></ArticleBlock>
        <ArticleBlock heading="THE TECHNOLOGY"><p className="body-p">{project.tech}</p></ArticleBlock>
      </div>

      <blockquote className="article__pull">{project.pull}</blockquote>

      {decisions && (
        <div className="article__decisions">
          <h3 className="article__section-h article__section-h--accent">DECISIONS & TRADE-OFFS</h3>
          <div className="article__decisions-grid" style={{ "--decision-count": decisions.length }}>
            {decisions.map(({ title, body }) => (
              <div key={title} className="article__decision">
                <div className="article__decision-title">{title}</div>
                <p className="body-p article__decision-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="spread-grid article__spread">
        <ArticleBlock heading="THE RESULT"><p className="body-p">{project.impact}</p></ArticleBlock>
        <ArticleBlock heading="FILED UNDER">
          <div className="article__tags">
            {project.stack.map((tech) => (
              <span key={tech} className="article__tag mono">{tech}</span>
            ))}
          </div>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="cta article__code-link">
              READ THE CODE ↗
            </a>
          )}
        </ArticleBlock>
      </div>
    </div>
  );
}
