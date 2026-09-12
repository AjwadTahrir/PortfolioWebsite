import { useState } from "react";
import useReportsData from "../../hooks/cms/useReportsData";
import useStatsData from "../../hooks/cms/useStatsData";
import useCrud from "../useCrud";

/* outcomes/stack-style arrays are edited as one line per item in a
   textarea — simplest possible UI for an ordered list of short strings. */
function linesToArray(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

const BLANK_REPORT = { title: "", outcomes: "", sort_order: 0 };
const BLANK_STAT = { value: "", label: "", sort_order: 0 };

export default function ReportsStatsEditor() {
  return (
    <div className="admin-split">
      <ReportsPanel />
      <StatsPanel />
    </div>
  );
}

function ReportsPanel() {
  const { reports, loading } = useReportsData();
  const { insert, update, remove, savingId, error } = useCrud("reports");
  const [draft, setDraft] = useState(BLANK_REPORT);

  const addReport = async (event) => {
    event.preventDefault();
    const ok = await insert({ title: draft.title, outcomes: linesToArray(draft.outcomes), sort_order: Number(draft.sort_order) || 0 });
    if (ok) setDraft(BLANK_REPORT);
  };

  return (
    <section>
      <h2 className="admin-panel-title mono">FIELD REPORTS</h2>
      {error && <p className="admin-error mono">{error}</p>}
      {loading ? <p className="mono">LOADING…</p> : reports.map((report) => (
        <ReportCard key={report.id} report={report} onSave={(patch) => update(report.id, patch)} onDelete={() => remove(report.id)} saving={savingId === report.id} />
      ))}
      <form className="admin-add-form" onSubmit={addReport}>
        <div className="admin-add-form__title mono">ADD REPORT</div>
        <input placeholder="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
        <textarea placeholder="one outcome per line" rows={3} value={draft.outcomes} onChange={(e) => setDraft({ ...draft, outcomes: e.target.value })} />
        <input type="number" placeholder="sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
        <button className="admin-btn" type="submit" disabled={savingId === "new"}>ADD</button>
      </form>
    </section>
  );
}

function ReportCard({ report, onSave, onDelete, saving }) {
  const [title, setTitle] = useState(report.title);
  const [outcomes, setOutcomes] = useState(report.outcomes.join("\n"));
  const [sortOrder, setSortOrder] = useState(report.sort_order);
  const dirty = title !== report.title || outcomes !== report.outcomes.join("\n") || Number(sortOrder) !== report.sort_order;

  return (
    <div className="admin-card">
      <input className="admin-cell" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="admin-cell" rows={Math.max(2, outcomes.split("\n").length)} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} />
      <div className="admin-card__foot">
        <input className="admin-cell admin-cell--narrow" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        <button className="admin-btn admin-btn--small" disabled={!dirty || saving} onClick={() => onSave({ title, outcomes: linesToArray(outcomes), sort_order: Number(sortOrder) || 0 })}>SAVE</button>
        <button className="admin-btn admin-btn--small admin-btn--danger" disabled={saving} onClick={() => confirm(`Delete "${report.title}"?`) && onDelete()}>DELETE</button>
      </div>
    </div>
  );
}

function StatsPanel() {
  const { stats, loading } = useStatsData();
  const { insert, update, remove, savingId, error } = useCrud("stats");
  const [draft, setDraft] = useState(BLANK_STAT);

  const addStat = async (event) => {
    event.preventDefault();
    const ok = await insert({ ...draft, sort_order: Number(draft.sort_order) || 0 });
    if (ok) setDraft(BLANK_STAT);
  };

  return (
    <section>
      <h2 className="admin-panel-title mono">BY THE NUMBERS</h2>
      {error && <p className="admin-error mono">{error}</p>}
      {loading ? <p className="mono">LOADING…</p> : (
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Value</th><th>Label</th><th /></tr></thead>
          <tbody>
            {stats.map((stat) => <StatRow key={stat.id} stat={stat} onSave={(patch) => update(stat.id, patch)} onDelete={() => remove(stat.id)} saving={savingId === stat.id} />)}
          </tbody>
        </table>
      )}
      <form className="admin-add-form" onSubmit={addStat}>
        <div className="admin-add-form__title mono">ADD STAT</div>
        <div className="admin-add-form__grid">
          <input placeholder="value (e.g. 50+)" value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} required />
          <input placeholder="label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} required />
          <input type="number" placeholder="sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
        </div>
        <button className="admin-btn" type="submit" disabled={savingId === "new"}>ADD</button>
      </form>
    </section>
  );
}

function StatRow({ stat, onSave, onDelete, saving }) {
  const [row, setRow] = useState(stat);
  const dirty = JSON.stringify(row) !== JSON.stringify(stat);
  const field = (key) => ({ value: row[key] ?? "", onChange: (e) => setRow({ ...row, [key]: e.target.value }) });

  return (
    <tr>
      <td><input className="admin-cell admin-cell--narrow" type="number" {...field("sort_order")} /></td>
      <td><input className="admin-cell admin-cell--narrow" {...field("value")} /></td>
      <td><input className="admin-cell" {...field("label")} /></td>
      <td className="admin-row-actions">
        <button className="admin-btn admin-btn--small" disabled={!dirty || saving} onClick={() => onSave({ ...row, sort_order: Number(row.sort_order) || 0 })}>SAVE</button>
        <button className="admin-btn admin-btn--small admin-btn--danger" disabled={saving} onClick={() => confirm(`Delete "${stat.label}"?`) && onDelete()}>DELETE</button>
      </td>
    </tr>
  );
}
