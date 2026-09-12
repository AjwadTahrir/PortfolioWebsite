import Reveal from "../ui/Reveal";
import "./layout.css";

/* Page-turn divider: a ghosted page number and the section's running title. */
export default function SectionBreak({ no, label }) {
  return (
    <div className="wrap section-break" aria-hidden="true">
      <div className="rule-thick" />
      <Reveal>
        <div className="section-break__row">
          <span className="section-break__no">{no}</span>
          <span className="section-break__label mono">{label}</span>
        </div>
      </Reveal>
      <div className="rule" />
    </div>
  );
}
