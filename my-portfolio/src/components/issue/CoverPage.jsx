import { SITE } from "../../constants/site";
import { pageOf } from "../../data/navigation";
import useToday from "../../hooks/useToday";
import { formatIssueDate } from "../../utils/format";
import "./cover.css";

/* Cover lines are promises about what is inside, each pointing at its page. */
function coverLines(project) {
  return [
    { id: "features", text: project?.coverStory?.headline?.join(" ") ?? "The cover story" },
    { id: "archive", text: "The archive: everything that is not code" },
    { id: "reports", text: "Field reports: outcomes, verified" },
  ];
}

/* Front of the issue: two pages, a beige left page with the masthead and a
   red right page carrying the cover lines. Entirely static. */
export default function CoverPage({ project }) {
  const date = formatIssueDate(useToday());
  const [first, ...rest] = SITE.name.split(" ");
  let letterIndex = 0;

  return (
    <section id="cover" className="cover">
      <h1 className="sr-only">{SITE.name}, the Software Engineer Issue</h1>
      <div className="cover__stage">
        {/* The right-hand page: a block of the site red against the coated-stock left page. */}
        <div className="cover__art" aria-hidden="true">
          <span className="cover__numeral">01</span>
        </div>

        <div className="cover__meta">
          <span>{SITE.volume}</span>
          <span>{date}</span>
          <span>{SITE.city}</span>
        </div>

        <div className="cover__title" aria-hidden="true">
          <div className="cover__title-inner">
            {[first, rest.join(" ")].map((word) => (
              <span key={word} className="cover__word">
                {[...word].map((letter) => (
                  <span key={letterIndex} className="cover__ch" style={{ "--c": letterIndex++ }}>{letter}</span>
                ))}
              </span>
            ))}
          </div>
        </div>


        <div className="cover__foot">
          <p className="cover__deck">The Software Engineer Issue</p>
        </div>

        {/* The cover lines sit on the red page, as teasers do on a real cover. */}
        <nav className="cover__teasers" aria-label="Inside this issue">
          <ul className="cover__lines">
            {coverLines(project).map(({ id, text }) => (
              <li key={id}>
                <a className="cover__line" href={`#${id}`}>
                  <span className="cover__line-text">{text}</span>
                  <span className="cover__line-pg mono">p. {pageOf(id).no}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
