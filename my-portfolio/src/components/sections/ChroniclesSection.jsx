import { ERAS } from "../../data/eras";
import EditorialSection from "../layout/EditorialSection";
import "./ChroniclesSection.css";

/* Vertical timeline, one era per year, with a ghosted year behind each. */
export default function ChroniclesSection() {
  return (
    <EditorialSection id="log" no="03" kicker="ENGINEERING LOG" breakLabel="ENGINEERING LOG · THE CHRONICLES" title="The Chronicles" className="chronicles">
      <div className="chronicles__list">
        {ERAS.map(({ year, era, milestones }) => (
          <div key={year} className="era">
            <div className="era__ghost" aria-hidden="true">{year}</div>
            <div className="era__grid">
              <div>
                <div className="era__year">{year}</div>
                <div className="era__name mono">{era}</div>
              </div>
              <div className="era__spine" aria-hidden="true">
                <div className="era__line" />
                <div className="era__dot" />
              </div>
              <ul className="era__milestones">
                {milestones.map(({ name, tag }) => (
                  <li key={name} className="era__milestone">
                    <span className="era__milestone-name">{name}</span>
                    <span className="era__milestone-tag mono">{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </EditorialSection>
  );
}
