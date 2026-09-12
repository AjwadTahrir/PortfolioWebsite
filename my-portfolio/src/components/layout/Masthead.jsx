import { Fragment } from "react";
import { SITE } from "../../constants/site";
import useToday from "../../hooks/useToday";
import { formatIssueDate } from "../../utils/format";
import "./Masthead.css";

const TAGLINE = ["AI SYSTEMS", "FULL STACK", "REAL-WORLD IMPACT"];

export default function Masthead({ onOpenPrintEdition }) {
  const today = useToday();

  return (
    <header className="wrap masthead">
      <div className="masthead__meta mono">
        <span>{SITE.volume}</span>
        <span className="masthead__date">{formatIssueDate(today).toUpperCase()}</span>
        <span className="masthead__place">
          {SITE.city}
          <button className="masthead__print-btn" onClick={onOpenPrintEdition}>PRINT EDITION ⎙</button>
        </span>
      </div>
      <div className="rule-thick masthead__top-rule" />
      <h1 className="masthead__title">{SITE.name}</h1>
      <div className="masthead__issue mono">THE SOFTWARE ENGINEER ISSUE</div>
      <div className="rule" />
      <div className="masthead__tagline mono">
        {TAGLINE.map((phrase, i) => (
          <Fragment key={phrase}>
            {i > 0 && <span className="masthead__dot">·</span>}
            <span>{phrase}</span>
          </Fragment>
        ))}
      </div>
      <div className="rule-thick" />
    </header>
  );
}
