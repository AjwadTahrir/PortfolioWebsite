import { PAGE_COUNT, PAGE_IDS, pageOf } from "../../data/navigation";
import useActiveSection from "../../hooks/useActiveSection";
import "./RunningHead.css";

/* The slim header that follows you down the issue: where you are, and a
   the page number, and a way to the Contents page. Transparent over the cover, newsprint after. */
export default function RunningHead({ onOpenContents }) {
  const activeId = useActiveSection(PAGE_IDS);
  const page = pageOf(activeId) ?? pageOf("cover");

  return (
    <header className="running-head">
      <a className="running-head__mark" href="#cover">Ajwad Tahrir</a>
      <span key={page.id} className="running-head__section" aria-hidden="true">{page.title}</span>
      <span className="running-head__folio" role="status" aria-label={`Page ${page.no} of ${PAGE_COUNT}`}>
        <span key={page.no} className="running-head__no">{page.no}</span>
        <span className="running-head__total">/ {String(PAGE_COUNT).padStart(2, "0")}</span>
      </span>
      <button className="running-head__contents" onClick={onOpenContents} aria-haspopup="dialog">
        Contents
      </button>
    </header>
  );
}
