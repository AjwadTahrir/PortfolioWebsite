import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { INK, RED, GREY, FAINT } from "../../constants/colors";
import { TRAVELS } from "../../data/travels";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function FieldNotesMap() {
  const [sel, setSel] = useState(TRAVELS[0]);

  return (
    <div className="spread-grid" style={{ gap: 40, alignItems: "start" }}>
      <div style={{ border: `1px solid ${INK}`, background: "#FDFCFA", overflow: "hidden" }}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 220, center: [70, 5] }} style={{ width: "100%", height: "auto" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo}
                  fill="#EFEBE3" stroke={FAINT} strokeWidth={0.5} />
              ))
            }
          </Geographies>
          {TRAVELS.map((t) => (
            <Marker key={t.id} coordinates={[t.lon, t.lat]} onClick={() => setSel(t)}>
              <circle r={t.id === "kl" ? 7 : (sel.id === t.id ? 6.5 : 4.5)}
                fill={sel.id === t.id ? RED : INK}
                stroke="#FDFCFA" strokeWidth={1.5}
                style={{ cursor: "pointer", pointerEvents: "none" }} />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div>
        <div style={{ border: `1px solid ${INK}`, background: "#FDFCFA", padding: "24px 26px", minHeight: 180 }}>
          <div className="mono" style={{ color: RED, letterSpacing: 2 }}>{sel.year}</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(24px,3vw,34px)", margin: "8px 0 12px" }}>
            {sel.label}
          </div>
          {sel.days && <div className="mono" style={{ color: GREY, marginBottom: 10 }}>{sel.days} DAYS</div>}
          <p className="body-p" style={{ fontSize: 15, lineHeight: 1.7 }}>{sel.note}</p>
        </div>

        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TRAVELS.map((t) => (
            <button key={`btn-${t.id}`} onClick={() => setSel(t)} className="mono"
              style={{
                border: `1px solid ${sel.id === t.id ? RED : INK}`,
                color: sel.id === t.id ? RED : INK,
                background: "none", padding: "6px 10px", cursor: "pointer",
                fontSize: 11, letterSpacing: 0.5,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}