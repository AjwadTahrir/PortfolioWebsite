import { useState } from "react";
import useCrud from "../useCrud";
import ImageUploadField from "./ImageUploadField";
import { deleteImage } from "../../lib/uploadImage";

/* Photos for an Archive tile: a list of { src, caption, tag, statLine,
   featured }, shown on the site as a contact sheet (Photography), a curated
   grid (Life), and, for the first photo, behind the tile. Tag/statLine/
   featured only do anything on Life's grid; Photography's plain contact
   sheet ignores them, so it's harmless to fill them in on any tile.
   `photos` is a column added by the editorial-redesign migration; until a
   row has it, the editor says so instead of failing on save. */
export default function PhotosEditor({ items }) {
  const withPhotos = items.filter((item) => "photos" in item);
  const [itemId, setItemId] = useState("photography");

  if (items.length && !withPhotos.length) {
    return (
      <div className="admin-add-form">
        <div className="admin-add-form__title mono">PHOTOS</div>
        <p className="admin-hint mono">
          Run <code>supabase/migrations/2026-09-editorial-redesign.sql</code> in the Supabase SQL editor to
          turn photos on, then reload this page.
        </p>
      </div>
    );
  }
  if (!withPhotos.length) return null;

  const item = withPhotos.find((entry) => entry.id === itemId) ?? withPhotos[0];
  return (
    <div className="admin-add-form">
      <div className="admin-add-form__title mono">PHOTOS</div>
      <label className="admin-field">
        <span className="mono">TILE</span>
        <select value={item.id} onChange={(e) => setItemId(e.target.value)}>
          {withPhotos.map((entry) => <option key={entry.id} value={entry.id}>{entry.title} ({entry.id})</option>)}
        </select>
      </label>
      {/* Keyed by tile so switching tiles resets the working copy. */}
      <PhotoList key={item.id} item={item} />
    </div>
  );
}

function PhotoList({ item }) {
  const { update, savingId, error } = useCrud("archive_items");
  const [photos, setPhotos] = useState(item.photos ?? []);
  const dirty = JSON.stringify(photos) !== JSON.stringify(item.photos ?? []);

  const change = (i, patch) => setPhotos(photos.map((photo, idx) => (idx === i ? { ...photo, ...patch } : photo)));
  const move = (i, by) => {
    const j = i + by;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    setPhotos(next);
  };

  return (
    <>
      {error && <p className="admin-error mono">{error}</p>}
      <p className="admin-hint mono">
        Use 3:2 photos, about 1600px on the long side. A caption of place and year works well. The first
        photo is also shown behind the tile. Tag, stat line and Featured only matter on Life&apos;s grid.
      </p>
      {photos.map((photo, i) => (
        <div key={i} className="admin-repeat-row admin-repeat-row--visual">
          <ImageUploadField value={photo.src} onChange={(src) => change(i, { src })} projectId={`archive-${item.id}`} />
          <input placeholder="caption (e.g. A late evening after class)" value={photo.caption || ""} onChange={(e) => change(i, { caption: e.target.value })} />
          <div className="admin-add-form__grid">
            <input placeholder="tag, optional (e.g. Running)" value={photo.tag || ""} onChange={(e) => change(i, { tag: e.target.value })} />
            <input placeholder="stat line, optional (e.g. 21.1 km · 2026)" value={photo.statLine || ""} onChange={(e) => change(i, { statLine: e.target.value })} />
            <label className="admin-checkbox">
              <input type="checkbox" checked={!!photo.featured} onChange={(e) => change(i, { featured: e.target.checked })} />
              <span className="mono">Featured (full width)</span>
            </label>
          </div>
          <div className="admin-row-actions">
            <button type="button" className="admin-btn admin-btn--small" disabled={i === 0} onClick={() => move(i, -1)}>UP</button>
            <button type="button" className="admin-btn admin-btn--small" disabled={i === photos.length - 1} onClick={() => move(i, 1)}>DOWN</button>
            <button
              type="button"
              className="admin-btn admin-btn--small admin-btn--danger"
              onClick={() => {
                if (photo.src) deleteImage(photo.src); // best-effort; the row is removed either way
                setPhotos(photos.filter((_, idx) => idx !== i));
              }}
            >
              REMOVE
            </button>
          </div>
        </div>
      ))}
      <div className="admin-row-actions">
        <button type="button" className="admin-btn admin-btn--small" onClick={() => setPhotos([...photos, { src: "", caption: "" }])}>+ ADD PHOTO</button>
        <button
          type="button"
          className="admin-btn admin-btn--small"
          disabled={!dirty || savingId === item.id}
          onClick={() => update(item.id, { photos: photos.filter((photo) => photo.src) })}
        >
          {savingId === item.id ? "SAVING…" : "SAVE PHOTOS"}
        </button>
      </div>
    </>
  );
}
