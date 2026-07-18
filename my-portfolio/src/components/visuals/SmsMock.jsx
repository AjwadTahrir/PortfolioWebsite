import React from "react";
import { INK, RED, GREY } from "../../constants/colors";

export default function SmsMock() {
  return (
    <div style={{ background: "#E9E5DD", padding: "22px 18px", height: "100%", minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 230, background: "#fff", border: `1px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
        <div style={{ background: INK, color: "#fff", padding: "8px 12px", fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 1 }}>
          SMS · SALTELLITE
        </div>
        <div style={{ padding: 14, fontSize: 12.5, lineHeight: 1.6 }}>
          <b style={{ color: RED }}>SALT RISK ALERT — ZONE 04</b>
          <br />High salinity risk detected in your area.
          <br /><br />Recommended action: increase freshwater irrigation before Thursday.
          <br /><br /><span style={{ color: GREY, fontSize: 11 }}>Sent 06:00 MYT · no app required</span>
        </div>
      </div>
    </div>
  );
}
