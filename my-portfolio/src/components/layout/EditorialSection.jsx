import Reveal from "../ui/Reveal";
import PageFoot from "./PageFoot";
import SectionBreak from "./SectionBreak";

/* A numbered magazine page: page-turn break, kicker ("02 · ENGINEERING
   NOTES"), headline, content, and the page folio.
   `className` carries the section's own spacing/styles. */
export default function EditorialSection({ id, no, kicker, breakLabel, title, className = "", children }) {
  return (
    <>
      <SectionBreak no={no} label={breakLabel} />
      <section id={id} className={`wrap ${className}`}>
        <Reveal>
          <div className="kicker">{no} · {kicker}</div>
          <h2 className="headline headline--section">{title}</h2>
          {children}
        </Reveal>
        <PageFoot no={no} />
      </section>
    </>
  );
}
