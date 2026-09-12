/* Small inline note shown in place of CMS content while it loads or if
   the fetch failed — keeps a section from just rendering blank. */
export default function StatusNote({ loading, error, emptyLabel }) {
  if (error) {
    return <p className="mono status-note status-note--error">COULD NOT LOAD — {error.message}</p>;
  }
  if (loading) {
    return <p className="mono status-note">LOADING…</p>;
  }
  return <p className="mono status-note">{emptyLabel}</p>;
}
