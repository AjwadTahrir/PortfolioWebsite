import Figure from "../../components/ui/Figure";
import Typewriter from "../../components/ui/Typewriter";
import Screenshot from "./visuals/Screenshot";
import "./CoverStory.css";

/* Front-page spread for the cover project; the whole spread opens its story. */
export default function CoverStory({ project, onOpen }) {
  const { coverStory } = project;
  const open = () => onOpen(project.id);
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  return (
    <section className="wrap cover-story">
      {/* A <button> can't contain the figure and heading, hence role="button". */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Read the cover story: ${project.name}`}
        className="cover-story__link"
        onClick={open}
        onKeyDown={onKeyDown}
      >
        <div className="cover-story__grid">
          <Figure no={coverStory.figure.no} caption={coverStory.figure.caption}>
            <Screenshot src={coverStory.figure.src} alt={coverStory.figure.alt} eager />
          </Figure>
          <div>
            <div className="cover-story__meta mono">
              <span className="cover-story__feature-no">FEATURE NO. {project.no}</span>
              <span className="cover-story__category">{coverStory.category}</span>
            </div>
            <h2 className="headline cover-story__headline">
              <Typewriter lines={coverStory.headline} speed={38} />
            </h2>
            <p className="cover-story__dek">{project.dek}</p>
            <div className="cover-story__cta mono">READ THE COVER STORY ↓</div>
            <div className="cover-story__stamp-row"><span className="stamp">EST. PASUM → UM</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
