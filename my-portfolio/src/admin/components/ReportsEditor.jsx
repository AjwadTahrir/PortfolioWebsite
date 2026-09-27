import { useState } from "react";
import useProjectsData from "../../hooks/cms/useProjectsData";
import useReportsData from "../../hooks/cms/useReportsData";
import useCrud from "../useCrud";

/* outcomes are edited as one line per item in a textarea: the simplest UI
   for an ordered list of short strings. */
function linesToArray(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

const BLANK_REPORT = { title: "", outcomes: "", year: "", project_id: "", sort_order: 0 };

/* `year` and `project_id` are columns added by the editorial-redesign
   migration. They are only written once a row has them (or you fill them in),
   so saving still works on a database that has not been migrated yet. */
function withOptionalFields(base, { year, project_id }, hasColumns) {
  const payload = { ...base };
  if (hasColumns || year) payload.year = year || null;
  if (hasColumns || project_id) payload.project_id = project_id || null;
  return payload;
}

export default function ReportsEditor() {
  const { reports, loading } = useReportsData();
  const { projects } = useProjectsData();
  const { insert, update, remove, savingId, error } = useCrud("reports");
  const [draft, setDraft] = useState(BLANK_REPORT);

  const addReport = async (event) => {
    event.preventDefault();
    const base = { title: draft.title, outcomes: linesToArray(draft.outcomes), sort_order: Number(draft.sort_order) || 0 };
    const ok = await insert(withOptionalFields(base, draft, reports.length > 0 && "year" in reports[0]));
    if (ok) setDraft(BLANK_REPORT);
  };

  return (
    <section className="admin-reports">
      <p className="admin-hint mono">
        The <b>first outcome line</b> is the big headline on the site, and the following lines are its supporting
        detail. Year and related project appear in the ledger; leave them empty if there is nothing to show.
      </p>
      {error && <p className="admin-error mono">{error}</p>}
      {loading ? <p className="mono">LOADING…</p> : reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          projects={projects}
          onSave={(patch) => update(report.id, patch)}
          onDelete={() => remove(report.id)}
          saving={savingId === report.id}
        />
      ))}
      <form className="admin-add-form" onSubmit={addReport}>
        <div className="admin-add-form__title mono">ADD REPORT</div>
        <input placeholder="event title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
        <textarea placeholder="outcomes, one per line (first line = headline)" rows={3} value={draft.outcomes} onChange={(e) => setDraft({ ...draft, outcomes: e.target.value })} />
        <div className="admin-add-form__grid">
          <input placeholder="year (optional)" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
          <ProjectSelect projects={projects} value={draft.project_id} onChange={(project_id) => setDraft({ ...draft, project_id })} />
          <input type="number" placeholder="sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
        </div>
        <button className="admin-btn" type="submit" disabled={savingId === "new"}>ADD</button>
      </form>
    </section>
  );
}

function ProjectSelect({ projects, value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">No related project</option>
      {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
    </select>
  );
}

function ReportCard({ report, projects, onSave, onDelete, saving }) {
  const hasColumns = "year" in report;
  const [title, setTitle] = useState(report.title);
  const [outcomes, setOutcomes] = useState(report.outcomes.join("\n"));
  const [year, setYear] = useState(report.year ?? "");
  const [projectId, setProjectId] = useState(report.project_id ?? "");
  const [sortOrder, setSortOrder] = useState(report.sort_order);
  const dirty =
    title !== report.title ||
    outcomes !== report.outcomes.join("\n") ||
    year !== (report.year ?? "") ||
    projectId !== (report.project_id ?? "") ||
    Number(sortOrder) !== report.sort_order;

  const save = () =>
    onSave(withOptionalFields(
      { title, outcomes: linesToArray(outcomes), sort_order: Number(sortOrder) || 0 },
      { year, project_id: projectId },
      hasColumns
    ));

  return (
    <div className="admin-card">
      <input className="admin-cell" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="admin-cell" rows={Math.max(2, outcomes.split("\n").length)} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} />
      <div className="admin-add-form__grid">
        <input className="admin-cell" placeholder="year" value={year} onChange={(e) => setYear(e.target.value)} />
        <ProjectSelect projects={projects} value={projectId} onChange={setProjectId} />
      </div>
      <div className="admin-card__foot">
        <input className="admin-cell admin-cell--narrow" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        <button className="admin-btn admin-btn--small" disabled={!dirty || saving} onClick={save}>SAVE</button>
        <button className="admin-btn admin-btn--small admin-btn--danger" disabled={saving} onClick={() => confirm(`Delete "${report.title}"?`) && onDelete()}>DELETE</button>
      </div>
    </div>
  );
}
