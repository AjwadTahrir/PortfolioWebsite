import { useRef, useState } from "react";
import uploadImage from "../../lib/uploadImage";

/* One image field: a thumbnail of whatever `value` currently points to
   (works for both a Storage URL and one of the original /screenshots/...
   public paths), an upload button that replaces it, and a plain text
   input so a path can still be typed or pasted by hand. `projectId`
   scopes where the file lands in the bucket. */
export default function ImageUploadField({ value, onChange, projectId, placeholder }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const pickFile = () => inputRef.current?.click();

  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    event.target.value = ""; // lets the same file be re-picked later if needed
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file, projectId);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      <div className="image-upload-field__preview">
        {value ? <img src={value} alt="" /> : <span className="mono">NO IMAGE</span>}
      </div>
      <div className="image-upload-field__controls">
        <input
          className="admin-cell"
          placeholder={placeholder || "src (paste a path, or upload below)"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFileSelected} />
        <button type="button" className="admin-btn admin-btn--small" onClick={pickFile} disabled={uploading || !projectId}>
          {uploading ? "UPLOADING…" : "UPLOAD IMAGE"}
        </button>
        {!projectId && <span className="image-upload-field__hint mono">set the project ID above first</span>}
        {error && <span className="admin-error mono">{error}</span>}
      </div>
    </div>
  );
}
