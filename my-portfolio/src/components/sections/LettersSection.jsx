import { SITE } from "../../constants/site";
import useToday from "../../hooks/useToday";
import "./LettersSection.css";

/* Closing page: contact details, "The end", and the colophon. */
export default function LettersSection() {
  const year = useToday().getFullYear();

  return (
    <section id="letters" className="letters snap-page">
      <div className="letters__body">
        <p className="letters__kicker">Letters to the editor</p>
        <h2 className="letters__name headline">{SITE.displayName}</h2>
        <p className="letters__role">Software engineer. AI, cloud and product engineering. Open to internships, hackathons and engineering projects.</p>
        <div className="letters__links">
          <a href={`mailto:${SITE.email}`} className="letters__link">Email</a>
          <a href={SITE.githubUrl} className="letters__link">GitHub</a>
          <a href={SITE.linkedinUrl} className="letters__link">LinkedIn</a>
        </div>
      </div>

      <div className="letters__end">
        <div className="letters__end-title headline">The end</div>
        <p className="letters__end-note">See you in Issue 02.</p>
      </div>

      <footer className="letters__colophon">
        <span>© {year} {SITE.displayName}. Volume 01, the Software Engineer Issue.</span>
        <span>Printed nowhere. Rendered everywhere.</span>
      </footer>
    </section>
  );
}
