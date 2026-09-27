import { useState } from "react";
import ImageUploadField from "./ImageUploadField";
import { deleteImage } from "../../lib/uploadImage";

export function blankProject() {
  return {
    id: "", no: "", importance: "note", kicker: "", name: "", dek: "",
    problem: "", tech: "", impact: "", pull: "", stack: [], link: "",
    year: String(new Date().getFullYear()), decisions: [], visuals: [],
    coverStory: null, sort_order: 0,
  };
}

const VISUAL_TYPES = ["screenshot", "pipeline", "use-case", "moscow"];

/* Full editor for one project row. Simple text fields are plain inputs;
   `stack` is comma-separated; `decisions` and `visuals` are repeatable
   groups (add/remove a row at a time); `coverStory` only appears when
   importance is "cover", since it's the only place it's read. The form
   works entirely in the camelCase shape the site's components use
   (matching what hooks/cms/useProjectsData returns); only the submit
   payload converts coverStory back to the DB's cover_story column. */
export default function ProjectForm({ initial, onSubmit, submitLabel, saving, isNew }) {
  const [project, setProject] = useState(() => ({
    ...initial,
    stackText: (initial.stack || []).join(", "),
  }));

  const set = (key) => (event) => setProject({ ...project, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    const { stackText, coverStory, ...rest } = project;
    // `tagline` is a column added by the editorial-redesign migration. Leave it
    // out of the save until the row has it (or you typed one), so saving still
    // works on a database that has not been migrated yet.
    if (!("tagline" in initial) && !rest.tagline) delete rest.tagline;
    const payload = {
      ...rest,
      stack: stackText.split(",").map((s) => s.trim()).filter(Boolean),
      sort_order: Number(project.sort_order) || 0,
      cover_story: project.importance === "cover" ? coverStory : null,
    };
    const ok = await onSubmit(payload);
    if (ok && isNew) setProject({ ...blankProject(), stackText: "" });
  };

  return (
    <form className="project-form" onSubmit={submit}>
      <div className="project-form__grid">
        <label className="admin-field">
          <span className="mono">ID (slug, used in URLs)</span>
          <input
            value={project.id}
            onChange={(e) => setProject({ ...project, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })}
            disabled={!isNew}
            required
          />
        </label>
        <label className="admin-field">
          <span className="mono">PAGE NO. (shown in the story header)</span>
          <input value={project.no} onChange={set("no")} required />
        </label>
        <label className="admin-field">
          <span className="mono">WHERE IT APPEARS IN THE WORK</span>
          <select value={project.importance} onChange={set("importance")}>
            <option value="cover">Cover story (the opening panel; use one)</option>
            <option value="feature">Feature (its own panel)</option>
            <option value="note">Note (a tile under &ldquo;Also in this issue&rdquo;)</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="mono">SORT ORDER (order within its group on the site)</span>
          <input type="number" value={project.sort_order} onChange={set("sort_order")} />
        </label>
        <label className="admin-field admin-field--wide">
          <span className="mono">KICKER</span>
          <input value={project.kicker} onChange={set("kicker")} required />
        </label>
        <label className="admin-field admin-field--wide">
          <span className="mono">NAME</span>
          <input value={project.name} onChange={set("name")} required />
        </label>
        <label className="admin-field admin-field--wide">
          <span className="mono">TAGLINE (one short line shown in The Work)</span>
          <input value={project.tagline ?? ""} onChange={set("tagline")} placeholder="e.g. Satellite intelligence for coastal farmland." />
        </label>
        <label className="admin-field admin-field--wide">
          <span className="mono">DEK</span>
          <textarea rows={2} value={project.dek} onChange={set("dek")} required />
        </label>
        <label className="admin-field">
          <span className="mono">STACK (comma-separated)</span>
          <input value={project.stackText} onChange={(e) => setProject({ ...project, stackText: e.target.value })} />
        </label>
        <label className="admin-field">
          <span className="mono">YEAR</span>
          <input value={project.year} onChange={set("year")} />
        </label>
        <label className="admin-field">
          <span className="mono">CODE LINK (optional)</span>
          <input value={project.link || ""} onChange={set("link")} />
        </label>
      </div>

      <label className="admin-field">
        <span className="mono">THE PROBLEM</span>
        <textarea rows={2} value={project.problem} onChange={set("problem")} required />
      </label>
      <label className="admin-field">
        <span className="mono">THE TECHNOLOGY</span>
        <textarea rows={2} value={project.tech} onChange={set("tech")} required />
      </label>
      <label className="admin-field">
        <span className="mono">THE RESULT</span>
        <textarea rows={2} value={project.impact} onChange={set("impact")} required />
      </label>
      <label className="admin-field">
        <span className="mono">PULL QUOTE</span>
        <textarea rows={2} value={project.pull} onChange={set("pull")} required />
      </label>

      <DecisionsEditor decisions={project.decisions || []} onChange={(decisions) => setProject({ ...project, decisions })} />
      <VisualsEditor visuals={project.visuals || []} onChange={(visuals) => setProject({ ...project, visuals })} projectId={project.id} />

      {project.importance === "cover" && (
        <CoverStoryEditor coverStory={project.coverStory} onChange={(coverStory) => setProject({ ...project, coverStory })} />
      )}

      <button className="admin-btn" type="submit" disabled={saving}>{saving ? "SAVING…" : submitLabel}</button>
    </form>
  );
}

/* ---- Decisions (title + body pairs) -------------------------------- */
function DecisionsEditor({ decisions, onChange }) {
  const update = (i, patch) => onChange(decisions.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const remove = (i) => onChange(decisions.filter((_, idx) => idx !== i));
  const add = () => onChange([...decisions, { title: "", body: "" }]);

  return (
    <fieldset className="admin-fieldset">
      <legend className="mono">DECISIONS &amp; TRADE-OFFS</legend>
      {decisions.map((d, i) => (
        <div key={i} className="admin-repeat-row">
          <input placeholder="title" value={d.title} onChange={(e) => update(i, { title: e.target.value })} />
          <textarea placeholder="body" rows={2} value={d.body} onChange={(e) => update(i, { body: e.target.value })} />
          <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => remove(i)}>REMOVE</button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--small" onClick={add}>+ ADD DECISION</button>
    </fieldset>
  );
}

/* ---- Visuals (typed rows: screenshot / pipeline / use-case / moscow) */
function VisualsEditor({ visuals, onChange, projectId }) {
  const update = (i, patch) => onChange(visuals.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const remove = (i) => {
    const visual = visuals[i];
    if (visual.type === "screenshot" && visual.src) deleteImage(visual.src); // best-effort; the row is removed either way
    onChange(visuals.filter((_, idx) => idx !== i));
  };
  const add = () => onChange([...visuals, { no: "", caption: "", type: "screenshot", src: "", alt: "" }]);

  return (
    <fieldset className="admin-fieldset">
      <legend className="mono">VISUALS</legend>
      {visuals.map((v, i) => (
        <div key={i} className="admin-repeat-row admin-repeat-row--visual">
          <div className="admin-add-form__grid">
            <input placeholder="fig. no (e.g. 1.1)" value={v.no || ""} onChange={(e) => update(i, { no: e.target.value })} />
            <input placeholder="caption" value={v.caption || ""} onChange={(e) => update(i, { caption: e.target.value })} />
            <select value={v.type} onChange={(e) => update(i, { type: e.target.value })}>
              {VISUAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {v.type === "screenshot" && (
            <>
              <ImageUploadField value={v.src} onChange={(src) => update(i, { src })} projectId={projectId} />
              <input placeholder="alt text" value={v.alt || ""} onChange={(e) => update(i, { alt: e.target.value })} />
            </>
          )}
          {v.type === "pipeline" && (
            <div className="admin-add-form__grid">
              <input placeholder="title" value={v.title || ""} onChange={(e) => update(i, { title: e.target.value })} />
              <input
                placeholder="steps, comma-separated"
                value={(v.steps || []).join(", ")}
                onChange={(e) => update(i, { steps: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
          )}
          <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => remove(i)}>REMOVE</button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--small" onClick={add}>+ ADD VISUAL</button>
    </fieldset>
  );
}

/* ---- Cover story (only read when importance === "cover") -----------
   The front page uses just the headline: it becomes the first cover line.
   Older category and figure values are kept untouched in the row (they are
   spread back on save) but are no longer shown, since nothing reads them. */
function CoverStoryEditor({ coverStory, onChange }) {
  const cs = coverStory || { headline: ["", "", ""] };
  const setHeadlineLine = (i, value) => {
    const headline = [...(cs.headline || ["", "", ""])];
    headline[i] = value;
    onChange({ ...cs, headline });
  };

  return (
    <fieldset className="admin-fieldset">
      <legend className="mono">COVER LINE (front page)</legend>
      <label className="admin-field">
        <span className="mono">HEADLINE (up to 3 lines, joined into the first cover line)</span>
        {[0, 1, 2].map((i) => (
          <input key={i} className="admin-headline-line" value={(cs.headline || [])[i] || ""} onChange={(e) => setHeadlineLine(i, e.target.value)} />
        ))}
      </label>
    </fieldset>
  );
}
