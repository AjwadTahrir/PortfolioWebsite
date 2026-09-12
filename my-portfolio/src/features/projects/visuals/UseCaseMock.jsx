import { CARD, GREY, INK } from "../../../constants/colors";

/* Illustrative UML use-case excerpt for the Pet Health Records story. */

export default function UseCaseMock() {
  return (
    <div style={{ background: CARD, height: "100%", minHeight: 240, padding: 14 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 8 }}>USE CASE MODEL · EXCERPT</div>
      <svg viewBox="0 0 260 150" style={{ width: "100%" }}>
        {[["Owner", 20, 44], ["Vet", 20, 112]].map(([n, x, y]) => (
          <g key={n} fontFamily="monospace" fontSize="8">
            <circle cx={x + 8} cy={y - 14} r="6" fill="none" stroke={INK} />
            <line x1={x + 8} y1={y - 8} x2={x + 8} y2={y + 6} stroke={INK} />
            <line x1={x} y1={y - 2} x2={x + 16} y2={y - 2} stroke={INK} />
            <line x1={x + 8} y1={y + 6} x2={x + 2} y2={y + 16} stroke={INK} />
            <line x1={x + 8} y1={y + 6} x2={x + 14} y2={y + 16} stroke={INK} />
            <text x={x + 8} y={y + 28} textAnchor="middle" fill={INK}>{n}</text>
          </g>
        ))}
        <rect x="90" y="10" width="162" height="132" fill="none" stroke={INK} />
        <text x="171" y="24" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={GREY}>PET HEALTH SYSTEM</text>
        {[["Book appointment", 58], ["View health record", 92], ["Update treatment", 124]].map(([n, y]) => (
          <g key={n}>
            <ellipse cx="171" cy={y} rx="62" ry="13" fill="#fff" stroke={INK} />
            <text x="171" y={y + 3} textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={INK}>{n}</text>
          </g>
        ))}
        <line x1="36" y1="40" x2="109" y2="56" stroke={GREY} />
        <line x1="36" y1="46" x2="109" y2="88" stroke={GREY} />
        <line x1="36" y1="110" x2="109" y2="122" stroke={GREY} />
        <line x1="36" y1="106" x2="109" y2="94" stroke={GREY} />
      </svg>
    </div>
  );
}
