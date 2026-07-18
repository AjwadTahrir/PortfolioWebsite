import React from "react";
import { INK, GREY } from "../../constants/colors";

export default function PipelineDiagram({ title, steps }) {
  return (
    <div style={{ border: `1px solid ${INK}`, borderBottom: "none", padding: "18px 16px", background: "#FDFCFA", height: "100%", minHeight: 240 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 12 }}>{title}</div>
      {steps.map((s, i) => (
        <div key={s} style={{ textAlign: "center" }}>
          <div style={{ border: `1px solid ${INK}`, padding: "6px 10px", fontFamily: "'Space Mono',monospace", fontSize: 10.5, background: i === steps.length - 1 ? INK : "#fff", color: i === steps.length - 1 ? "#fff" : INK }}>
            {s}
          </div>
          {i < steps.length - 1 && <div style={{ color: GREY, fontSize: 11, lineHeight: "14px" }}>↓</div>}
        </div>
      ))}
    </div>
  );
}
