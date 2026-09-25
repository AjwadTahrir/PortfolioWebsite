import { categoryOf, taglineOf, techOf, workGroups } from "../../data/work";
import { sentenceCase } from "../../utils/format";
import ProjectVisual from "./ProjectVisual";
import "./work.css";

/* One project as an opening spread: big name, tagline, a large 16:9 visual.
   The cover story and every feature use it; `label` and `tone` set what it
   says and how it is coloured. Sides alternate down the page. */
function Spread({ project, label, tone, flip, onOpen }) {
  const lead = project.visuals?.[0];
  return (
    <section id={project.id} className={`work__spread work__spread--${tone}${flip ? " is-flipped" : ""}${lead ? "" : " has-no-art"}`}>
      <div className="work__spread-text">
        <p className="work__label">{label}</p>
        <h3 className="work__name">{project.name}</h3>
        <p className="work__tagline">{taglineOf(project)}</p>
        <p className="work__meta">
          {sentenceCase(categoryOf(project))}. {techOf(project, 4).join(", ")}. {project.year}.
        </p>
        <button className="work__read" onClick={() => onOpen(project.id)}>Read the story</button>
      </div>
      {lead && (
        <button className="work__art" onClick={() => onOpen(project.id)} aria-label={`Read the story: ${project.name}`} tabIndex={-1}>
          <span className="work__frame"><ProjectVisual visual={lead} eager={label === "The cover story"} /></span>
        </button>
      )}
    </section>
  );
}

/* A note: a short piece, set typographically. No image, no card chrome; the
   colour block and the type do the work. Positions come from the bento grid. */
function Note({ project, onOpen }) {
  return (
    <button id={project.id} className="work__note" onClick={() => onOpen(project.id)}>
      <span className="work__note-year">{project.year}</span>
      <span className="work__note-cat">{sentenceCase(categoryOf(project))}</span>
      <span className="work__note-name">{project.name}</span>
      <span className="work__note-tagline">{taglineOf(project)}</span>
    </button>
  );
}

/* The section's title page: the title set very large, and a linked list of
   everything inside, so it doubles as a small contents for The Work. */
function TitlePage({ projects }) {
  return (
    <header className="work__title-page">
      <p className="work__kicker">The issue continues</p>
      <h2 className="headline work__title">The Work</h2>
      <div className="work__inside">
        <p className="work__inside-label">In this section</p>
        <ol className="work__inside-list">
          {projects.map((project) => (
            <li key={project.id}>
              <a className="work__inside-link" href={`#${project.id}`}>
                <span className="work__inside-name">{project.name}</span>
                <span className="work__inside-year">{project.year}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <p className="work__deck">Things I have built.</p>
    </header>
  );
}

/* The Work: things I've built. A title page, then the cover story and each
   feature as an opening spread; the shorter pieces sit together in a bento
   grid. Add projects as data (their importance label decides where they go). */
export default function WorkSection({ projects, onOpen }) {
  const { cover, features, notes } = workGroups(projects);

  return (
    <main id="features" className="work snap-page">
      <TitlePage projects={[cover, ...features, ...notes].filter(Boolean)} />

      {cover && <Spread project={cover} label="The cover story" tone="ink" onOpen={onOpen} />}
      {features.map((project, i) => (
        <Spread
          key={project.id}
          project={project}
          label="Feature"
          tone={i % 2 === 0 ? "well" : "ink"}
          flip={i % 2 === 0}
          onOpen={onOpen}
        />
      ))}

      {notes.length > 0 && (
        <section className="work__notes" aria-labelledby="work-notes-title">
          <h3 id="work-notes-title" className="work__notes-title">Also in this issue</h3>
          <div className="work__bento">
            {notes.map((project) => <Note key={project.id} project={project} onOpen={onOpen} />)}
          </div>
        </section>
      )}
    </main>
  );
}
