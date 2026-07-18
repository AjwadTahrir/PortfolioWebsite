import React from "react";
import { INK, GREY } from "../../constants/colors";

export default function Fig({ children, caption, no }) {
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ border: `1px solid ${INK}`, flex: 1 }}>{children}</div>
      <figcaption className="mono" style={{ color: GREY, padding: "8px 0", borderBottom: `1px solid ${INK}` }}>
        <span style={{ color: INK, fontWeight: 700 }}>FIG. {no}</span> — {caption}
      </figcaption>
    </figure>
  );
}
