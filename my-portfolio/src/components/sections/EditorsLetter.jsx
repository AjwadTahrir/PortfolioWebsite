import { SITE } from "../../constants/site";
import Reveal from "../ui/Reveal";
import "./EditorsLetter.css";

const ISSUE_TALLY = ["1 SATELLITE", "50 REQUIREMENTS", "105 SURVEY RESPONSES", "10 DEVELOPERS"];

/* Unnumbered front matter. */
export default function EditorsLetter() {
  return (
    <section id="editors-letter" className="wrap editors-letter">
      <Reveal>
        <div className="editors-letter__grid">
          <div className="editors-letter__dateline mono">
            FROM THE EDITOR<br />{SITE.volume} · {SITE.city}
          </div>
          <div>
            <p className="editors-letter__opening">
              I started this issue with a simple observation: the most interesting software
              problems don't live in software.
            </p>
            <p className="body-p editors-letter__body editors-letter__body--first">
              They live in paddy fields where salt creeps in unseen, in ten-person teams trying
              to agree on what "done" means, in the gap between a working demo and a system
              someone actually relies on. Everything in this issue — a satellite watching
              Malaysian farmland, a nutrition backend that had to survive ten contributors,
              a requirements package that took a semester to specify — comes from that gap.
            </p>
            <p className="body-p editors-letter__body">
              My rule while building all of it: working software over theoretical completeness.
              Ship the thing, learn from the contact with reality, write down what broke.
              This issue is the writing-down part.
            </p>
            <div className="editors-letter__signoff">
              <div className="editors-letter__signature">Ajwad Tahrir</div>
              <div className="editors-letter__role mono">EDITOR & SOLE CONTRIBUTOR · JULY 2026</div>
            </div>
          </div>
          <div className="editors-letter__tally mono" aria-hidden="true">
            <div className="editors-letter__tally-list">
              IN THIS ISSUE:<br />
              {ISSUE_TALLY.map((line) => (
                <span key={line}>{line}<br /></span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
