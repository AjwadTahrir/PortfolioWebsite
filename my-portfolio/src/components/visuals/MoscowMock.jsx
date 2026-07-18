import React from "react";
import { INK, GREY, FAINT } from "../../constants/colors";

export default function MoscowMock() {
  const cols = [["MUST", 5, INK], ["SHOULD", 4, "#4A4A55"], ["COULD", 3, GREY], ["WON'T", 2, FAINT]];
  return (
    <div style={{ background: "#FDFCFA", height: "100%", minHeight: 240, padding: 14 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 10 }}>MOSCOW BACKLOG · 23 ITEMS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {cols.map(([label, n, color]) => (
          <div key={label}>
            <div className="mono" style={{ fontSize: 9, borderBottom: `2px solid ${color}`, paddingBottom: 4, marginBottom: 6 }}>{label}</div>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} style={{ height: 14, background: "#fff", border: `1px solid ${FAINT}`, marginBottom: 4 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
