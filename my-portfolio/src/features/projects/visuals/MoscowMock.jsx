import { CARD, FAINT, GREY, INK } from "../../../constants/colors";

/* Illustrative MoSCoW board for the Pet Health Records story. */
const COLUMNS = [
  { label: "MUST", cards: 5, color: INK },
  { label: "SHOULD", cards: 4, color: "#4A4A55" },
  { label: "COULD", cards: 3, color: GREY },
  { label: "WON'T", cards: 2, color: FAINT },
];

export default function MoscowMock() {
  return (
    <div style={{ background: CARD, height: "100%", minHeight: 240, padding: 14 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 10 }}>MOSCOW BACKLOG · 23 ITEMS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {COLUMNS.map(({ label, cards, color }) => (
          <div key={label}>
            <div className="mono" style={{ fontSize: 9, borderBottom: `2px solid ${color}`, paddingBottom: 4, marginBottom: 6 }}>{label}</div>
            {Array.from({ length: cards }, (_, i) => (
              <div key={i} style={{ height: 14, background: "#fff", border: `1px solid ${FAINT}`, marginBottom: 4 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
