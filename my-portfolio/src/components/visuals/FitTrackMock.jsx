import React from "react";
import { INK, GREY, FAINT } from "../../constants/colors";

export default function FitTrackMock() {
  const rows = [["Breakfast", "512 kcal"], ["Lunch", "746 kcal"], ["Dinner", "618 kcal"], ["Water", "1.9 / 2.5 L"]];
  return (
    <div style={{ background: "#FDFCFA", height: "100%", minHeight: 240 }}>
      <div style={{ background: INK, color: "#fff", padding: "8px 12px", fontFamily: "'Space Mono',monospace", fontSize: 10, display: "flex", justifyContent: "space-between" }}>
        <span>FITTRACK · NUTRITION PLANNER</span><span>JWT ✓</span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 26 }}>1,876</span>
          <span className="mono" style={{ color: GREY }}>/ 2,200 KCAL</span>
        </div>
        <div style={{ height: 8, background: "#E7E3DA", margin: "8px 0 14px" }}>
          <div style={{ height: "100%", width: "85%", background: INK }} />
        </div>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px dotted ${FAINT}`, fontSize: 13 }}>
            <span>{k}</span><span className="mono">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
