import React from "react";

export default function SatelliteView({ hero }) {
  const cells = [];
  const cols = 14, rows = hero ? 8 : 6;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 31 + c * 17) % 97;
      const coastal = c > cols - 4 - (r % 3);
      const risk = coastal ? seed % 3 : seed % 7 === 0 ? 1 : 0;
      cells.push({ r, c, risk, seed });
    }
  }
  const greens = ["#7C8F5E", "#8C9E6B", "#6E8253", "#93A375", "#849868"];
  const riskFill = ["transparent", "rgba(224,192,103,0.55)", "rgba(200,55,30,0.5)"];
  const W = 560, H = hero ? 330 : 240, cw = W / cols, ch = H / rows;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", background: "#5B6E8C" }} role="img" aria-label="Satellite view of coastal farmland with salinity risk overlay">
      <rect x={W - 90} y="0" width="90" height={H} fill="#4F678C" />
      {cells.map(({ r, c, risk, seed }) => (
        <g key={`${r}-${c}`}>
          <rect x={c * cw} y={r * ch} width={cw - 1.5} height={ch - 1.5} fill={greens[seed % 5]} />
          {risk > 0 && <rect x={c * cw} y={r * ch} width={cw - 1.5} height={ch - 1.5} fill={riskFill[risk]} />}
        </g>
      ))}
      <rect x="12" y="12" width="158" height="20" fill="rgba(20,20,20,0.78)" />
      <text x="20" y="26" fill="#fff" fontFamily="monospace" fontSize="10">SENTINEL-2 · L2A · B11/B8A</text>
      <rect x="12" y={H - 34} width="196" height="22" fill="rgba(20,20,20,0.78)" />
      <text x="20" y={H - 19} fill="#fff" fontFamily="monospace" fontSize="10">SELANGOR COAST · ALT 786 KM</text>
      <g fontFamily="monospace" fontSize="9" fill="#fff">
        <rect x={W - 162} y="12" width="150" height="46" fill="rgba(20,20,20,0.78)" />
        <rect x={W - 152} y="20" width="10" height="8" fill="rgba(224,192,103,0.9)" />
        <text x={W - 136} y="27">SALINITY WATCH</text>
        <rect x={W - 152} y="36" width="10" height="8" fill="rgba(200,55,30,0.9)" />
        <text x={W - 136} y="43">HIGH RISK ZONE</text>
      </g>
      <g stroke="#fff" strokeWidth="1.5" fill="none">
        <rect x={cw * 10} y={ch * 2} width={cw * 2} height={ch * 2} strokeDasharray="4 3" />
      </g>
      <text x={cw * 10} y={ch * 2 - 5} fill="#fff" fontFamily="monospace" fontSize="9">ZONE 04</text>
    </svg>
  );
}
