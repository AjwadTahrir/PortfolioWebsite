import "../../components/ui/tile.css";

export default function ArchiveGrid({ items, onOpen }) {
  return (
    <div className="archive-grid">
      {items.map((item) => (
        <button
          key={item.id}
          className={`tile archive-tile archive-tile--${item.id}`}
          onClick={() => onOpen(item.id)}
        >
          <div className="tile__body">
            <div className="tile__label mono">{item.kicker}</div>
            <div className="tile__name headline">{item.title}</div>
            <div className="tile__dek">{item.dek}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
