import { SITE } from "../../constants/site";
import "./EditorsLetter.css";

/* [count, what it counted]: the count is set huge, the noun beside it. */
const ISSUE_TALLY = [
  ["1", "satellite"],
  ["50", "requirements"],
  ["105", "survey responses"],
  ["10", "developers"],
];

export default function EditorsLetter() {
  return (
    <section id="editors-letter" className="editors-letter snap-page">
      <div className="editors-letter__grid">
        <div className="editors-letter__dateline">
          <p>From the editor</p>
          <p>Volume 01, {SITE.cityName}</p>
        </div>

        <div className="editors-letter__letter">
          <p className="editors-letter__opening">
            I started this issue with a simple observation: the most interesting software
            problems don't live in software.
          </p>
          <p className="editors-letter__body">
            They live in paddy fields where salt creeps in unseen, in ten-person teams trying
            to agree on what "done" means, in the gap between a working demo and a system
            someone actually relies on. Everything in this issue, a satellite watching
            Malaysian farmland, a nutrition backend that had to survive ten contributors,
            a requirements package that took a semester to specify, comes from that gap.
          </p>
          <p className="editors-letter__body">
            My rule while building all of it: working software over theoretical completeness.
            Ship the thing, learn from the contact with reality, write down what broke.
            This issue is the writing-down part.
          </p>
          <p className="editors-letter__signature">Ajwad Tahrir</p>
          <p className="editors-letter__role">Editor and sole contributor, July 2026</p>
        </div>

        <ul className="editors-letter__tally" aria-label="In this issue">
          {ISSUE_TALLY.map(([count, noun]) => (
            <li key={noun}>
              <span className="editors-letter__count">{count}</span>
              <span className="editors-letter__noun">{noun}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
