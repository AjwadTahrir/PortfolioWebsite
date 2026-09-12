import { useState } from "react";
import useArchiveData from "../../hooks/cms/useArchiveData";
import useCrud from "../useCrud";

const BLANK = { id: "", kicker: "", title: "", dek: "", placeholder: "", sort_order: 0 };

export default function ArchiveEditor() {
  const { archive, loading } = useArchiveData();
  const { insert, update, remove, savingId, error } = useCrud("archive_items");
  const [draft, setDraft] = useState(BLANK);

  const addItem = async (event) => {
    event.preventDefault();
    const ok = await insert({ ...draft, sort_order: Number(draft.sort_order) || 0 });
    if (ok) setDraft(BLANK);
  };

  return (
    <div>
      <p className="admin-hint mono">
        The tile's <b>id</b> also picks its position in the bento grid (see the grid-template-areas
        in <code>features/archive/archive.css</code>) — use one of the five existing ids to replace
        that tile, or add a new grid-area in the CSS for a new one.
      </p>
      {error && <p className="admin-error mono">{error}</p>}
      {loading ? (
        <p className="mono">LOADING…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>ID</th><th>Kicker</th><th>Title</th><th>Dek</th><th>Placeholder</th><th /></tr>
          </thead>
          <tbody>
            {archive.map((item) => (
              <ArchiveRow key={item.id} item={item} onSave={(patch) => update(item.id, patch)} onDelete={() => remove(item.id)} saving={savingId === item.id} />
            ))}
          </tbody>
        </table>
      )}

      <form className="admin-add-form" onSubmit={addItem}>
        <div className="admin-add-form__title mono">ADD TILE</div>
        <div className="admin-add-form__grid">
          <input placeholder="id (e.g. photography)" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} required />
          <input placeholder="kicker" value={draft.kicker} onChange={(e) => setDraft({ ...draft, kicker: e.target.value })} required />
          <input placeholder="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <input placeholder="dek" value={draft.dek} onChange={(e) => setDraft({ ...draft, dek: e.target.value })} required />
          <input placeholder="placeholder (optional)" value={draft.placeholder} onChange={(e) => setDraft({ ...draft, placeholder: e.target.value })} />
          <input type="number" placeholder="sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
        </div>
        <button className="admin-btn" type="submit" disabled={savingId === "new"}>ADD</button>
      </form>
    </div>
  );
}

function ArchiveRow({ item, onSave, onDelete, saving }) {
  const [row, setRow] = useState(item);
  const dirty = JSON.stringify(row) !== JSON.stringify(item);
  const field = (key) => ({
    value: row[key] ?? "",
    onChange: (e) => setRow({ ...row, [key]: e.target.value }),
  });

  return (
    <tr>
      <td><input className="admin-cell admin-cell--narrow" type="number" {...field("sort_order")} /></td>
      <td className="mono">{item.id}</td>
      <td><input className="admin-cell" {...field("kicker")} /></td>
      <td><input className="admin-cell" {...field("title")} /></td>
      <td><input className="admin-cell" {...field("dek")} /></td>
      <td><input className="admin-cell" {...field("placeholder")} /></td>
      <td className="admin-row-actions">
        <button className="admin-btn admin-btn--small" disabled={!dirty || saving} onClick={() => onSave({ ...row, sort_order: Number(row.sort_order) || 0 })}>
          SAVE
        </button>
        <button className="admin-btn admin-btn--small admin-btn--danger" disabled={saving} onClick={() => confirm(`Delete "${item.title}"?`) && onDelete()}>
          DELETE
        </button>
      </td>
    </tr>
  );
}
