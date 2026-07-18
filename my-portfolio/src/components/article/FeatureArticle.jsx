import React from "react";
import { INK, RED, GREY, FAINT } from "../../constants/colors";
import Fig from "../common/Fig";

/* The full feature article body — extracted from the old inline-expand
   Feature so the overlay can render it. Purely presentational. */
export default function FeatureArticle({ p }) {
  return (
    <div style={{ padding: "4px 0 8px" }}>
      <div className="frames-row">
        {(p.visuals || []).map((v) => (
          <Fig key={v.no} no={v.no} caption={v.caption}>{v.el}</Fig>
        ))}
      </div>
      <div className="spread-grid" style={{ marginTop: 28 }}>
        <div>
          <h3 className="section-h">THE PROBLEM</h3>
          <p className="body-p">{p.problem}</p>
        </div>
        <div>
          <h3 className="section-h">THE TECHNOLOGY</h3>
          <p className="body-p">{p.tech}</p>
        </div>
      </div>
      <blockquote className="pull">{p.pull}</blockquote>
      {p.decisions && (
        <div style={{ marginTop: 6 }}>
          <h3 className="section-h" style={{ color: RED }}>DECISIONS & TRADE-OFFS</h3>
          <div className="decisions-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${p.decisions.length}, 1fr)`, gap: 24, marginTop: 12 }}>
            {p.decisions.map(([title, body]) => (
              <div key={title} style={{ borderTop: `2px solid ${INK}`, paddingTop: 12 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{title}</div>
                <p className="body-p" style={{ fontSize: 14.5, lineHeight: 1.65, color: "#3E3D48" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="spread-grid" style={{ marginTop: 28 }}>
        <div>
          <h3 className="section-h">THE RESULT</h3>
          <p className="body-p">{p.impact}</p>
        </div>
        <div>
          <h3 className="section-h">FILED UNDER</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {p.stack.map((s) => (
              <span key={s} className="mono" style={{ border: `1px solid ${FAINT}`, color: GREY, padding: "4px 10px" }}>{s}</span>
            ))}
          </div>
          {p.link && (
            <a href={p.link} target="_blank" rel="noreferrer" className="cta" style={{ marginTop: 18 }}>
              READ THE CODE ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
