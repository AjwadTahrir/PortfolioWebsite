import { SITE } from "../../constants/site";
import useToday from "../../hooks/useToday";
import Reveal from "../ui/Reveal";
import "./LettersSection.css";

/* Closing page: contact details, "THE END", and the colophon. */
export default function LettersSection() {
  const year = useToday().getFullYear();

  return (
    <section id="letters" className="letters">
      <Reveal>
        <div className="wrap letters__body">
          <div className="kicker">07 · LETTERS TO THE EDITOR</div>
          <h2 className="letters__name">{SITE.name}</h2>
          <div className="letters__role mono">SOFTWARE ENGINEER · AI × CLOUD × PRODUCT ENGINEERING</div>
          <div className="letters__divider" />
          <div className="letters__availability mono">
            AVAILABLE FOR — INTERNSHIPS · HACKATHONS · ENGINEERING PROJECTS
          </div>
          <div className="letters__links">
            <a href={`mailto:${SITE.email}`} className="cta">EMAIL ✉</a>
            <a href={SITE.githubUrl} className="cta-ghost">GITHUB ↗</a>
            <a href={SITE.linkedinUrl} className="cta-ghost">LINKEDIN ↗</a>
          </div>

          <div className="letters__end">
            <div className="letters__end-title">THE END</div>
            <div className="letters__end-note mono">
              {SITE.issue} · PRINTED JULY {year}<br />
              SEE YOU IN ISSUE 02.
            </div>
          </div>
        </div>
        <footer className="wrap letters__colophon mono">
          <span>© {year} {SITE.name} — {SITE.volume}, THE SOFTWARE ENGINEER ISSUE</span>
          <span>PRINTED NOWHERE. RENDERED EVERYWHERE.</span>
        </footer>
      </Reveal>
    </section>
  );
}
