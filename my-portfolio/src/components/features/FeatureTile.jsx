import React from "react";
import { GREY } from "../../constants/colors";

/* One tile in the features grid. `variant` (cover|feature|note) drives size
   and whether a visual is shown. Clicking calls onOpen(p.id). */
export default function FeatureTile({ p, variant, label, onOpen }) {
  const visual = p.visuals && p.visuals[0] ? p.visuals[0].el : null;
  const hasVisual = variant !== "note" && !!visual;
  const headSize =
    variant === "cover" ? "clamp(30px,4vw,52px)"
    : variant === "feature" ? "clamp(24px,2.6vw,36px)"
    : "clamp(19px,2vw,24px)";

  return (
    <button
      id={p.id}
      className={`feat-tile feat-tile--${variant}`}
      onClick={() => onOpen(p.id)}
      style={{ scrollMarginTop: 80 }}
    >
      {hasVisual && visual && (
        <div className="feat-tile__visual">{visual}</div>
      )}
      <div className="feat-tile__body">
        <div className="kicker feat-tile__label">{label}</div>
        <h3 className="feat-tile__name" style={{ fontSize: headSize }}>{p.name}</h3>
        {variant !== "note" && (
          <p className="feat-tile__dek">{p.dek}</p>
        )}
        <div className="feat-tile__foot">
          <div className="feat-tile__stack mono">
            {p.stack.slice(0, variant === "note" ? 4 : 3).join(" · ")}
          </div>
          <div className="feat-tile__meta">
            <span className="mono" style={{ color: GREY }}>{p.year}</span>
            <span className="mono feat-tile__cta">READ STORY ↗</span>
          </div>
        </div>
      </div>
    </button>
  );
}
