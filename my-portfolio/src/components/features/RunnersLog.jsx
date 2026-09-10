import React from "react";
import { INK, RED, GREY, FAINT } from "../../constants/colors";
import { PERSONAL_BESTS, RUN_TIMELINE, TOTAL_DISTANCE_KM } from "../../data/runs";

export default function RunnersLog() {
  const pct = Math.min(100, (TOTAL_DISTANCE_KM / 500) * 100); // adjust 500 to whatever milestone feels right

  return (
    <div className="spread-grid" style={{ gap: 40, alignItems: "start" }}>
      <div style={{ border: `1px solid ${INK}`, background: "#FDFCFA", padding: "24px 26px" }}>
        <div className="mono" style={{ letterSpacing: 2, color: GREY, marginBottom: 14 }}>PERSONAL BESTS</div>
        {PERSONAL_BESTS.map((pb) => (
          <div key={pb.dist} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px dotted ${FAINT}` }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18 }}>{pb.dist}</span>
            <span className="mono" style={{ color: RED }}>{pb.time}</span>
          </div>
        ))}
        <div className="mono" style={{ letterSpacing: 2, color: GREY, margin: "22px 0 8px" }}>TOTAL DISTANCE</div>
        <div style={{ height: 10, border: `1px solid ${INK}`, background: "#EFEBE3" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: INK }} />
        </div>
      </div>

      <div>
        {RUN_TIMELINE.map((label, i) => (
          <div key={label} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "10px 0" }}>
            <span className="mono" style={{ color: FAINT, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontWeight: 700, fontSize: 15.5 }}>{label}</span>
            {i < RUN_TIMELINE.length - 1 && <span style={{ color: FAINT }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}