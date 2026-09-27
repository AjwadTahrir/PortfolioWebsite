/* The layout, by tile id: two rows, so a tile can grow inside its row while
   its neighbours give way. Tiles the data adds later fall into a final row. */
const ROWS = [["running", "university", "travel"], ["photography", "life"]];

function rowsOf(items) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const placed = new Set(ROWS.flat());
  const rows = ROWS.map((ids) => ids.map((id) => byId.get(id)).filter(Boolean));
  const extra = items.filter((item) => !placed.has(item.id));
  return [...rows, extra].filter((row) => row.length);
}

/* Typographic art: the initial of the tile's kicker, enormous and cropped by the tile edge. */
function Tile({ item, onOpen }) {
  return (
    <button
      className={`archive-tile archive-tile--${item.id}`}
      onClick={(event) => onOpen(item.id, event.currentTarget)}
    >
      {item.photos?.[0]?.src && <img className="archive-tile__photo" src={item.photos[0].src} alt="" loading="lazy" decoding="async" />}
      <span className="archive-tile__glyph" aria-hidden="true">{item.kicker.charAt(0).toUpperCase()}</span>
      <span className="archive-tile__kicker">{item.kicker}</span>
      <span className="archive-tile__title">{item.title}</span>
      <span className="archive-tile__dek">{item.dek}</span>
    </button>
  );
}

export default function ArchiveGrid({ items, onOpen }) {
  return (
    <div className="archive-grid">
      {rowsOf(items).map((row, i) => (
        <div key={i} className="archive-row">
          {row.map((item) => <Tile key={item.id} item={item} onOpen={onOpen} />)}
        </div>
      ))}
    </div>
  );
}
