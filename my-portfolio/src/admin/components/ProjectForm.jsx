import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

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
          <input value={project.id} onChange={set("id")} disabled={!isNew} required />
        </label>
        <label className="admin-field">
          <span className="mono">PAGE NO.</span>
          <input value={project.no} onChange={set("no")} required />
        </label>
        <label className="admin-field">
          <span className="mono">SECTION</span>
          <select value={project.importance} onChange={set("importance")}>
            <option value="cover">Cover story</option>
            <option value="feature">Feature story</option>
            <option value="note">Engineering note</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="mono">SORT ORDER</span>
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
        <CoverStoryEditor coverStory={project.coverStory} onChange={(coverStory) => setProject({ ...project, coverStory })} projectId={project.id} />
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
  const remove = (i) => onChange(visuals.filter((_, idx) => idx !== i));
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

/* ---- Cover story (only read when importance === "cover") ----------- */
function CoverStoryEditor({ coverStory, onChange, projectId }) {
  const cs = coverStory || { category: "", headline: ["", "", ""], figure: { no: "", caption: "", src: "", alt: "" } };
  const setField = (key, value) => onChange({ ...cs, [key]: value });
  const setHeadlineLine = (i, value) => {
    const headline = [...cs.headline];
    headline[i] = value;
    onChange({ ...cs, headline });
  };
  const setFigure = (key, value) => onChange({ ...cs, figure: { ...cs.figure, [key]: value } });

  return (
    <fieldset className="admin-fieldset">
      <legend className="mono">COVER STORY (front page spread)</legend>
      <label className="admin-field">
        <span className="mono">CATEGORY</span>
        <input value={cs.category} onChange={(e) => setField("category", e.target.value)} />
      </label>
      <label className="admin-field">
        <span className="mono">HEADLINE (3 lines, typed out on the front page)</span>
        {[0, 1, 2].map((i) => (
          <input key={i} className="admin-headline-line" value={cs.headline[i] || ""} onChange={(e) => setHeadlineLine(i, e.target.value)} />
        ))}
      </label>
      <div className="admin-add-form__grid">
        <input placeholder="fig. no" value={cs.figure.no} onChange={(e) => setFigure("no", e.target.value)} />
        <input placeholder="caption" value={cs.figure.caption} onChange={(e) => setFigure("caption", e.target.value)} />
        <input placeholder="alt text" value={cs.figure.alt} onChange={(e) => setFigure("alt", e.target.value)} />
      </div>
      <ImageUploadField value={cs.figure.src} onChange={(src) => setFigure("src", src)} projectId={projectId} />
    </fieldset>
  );
}
