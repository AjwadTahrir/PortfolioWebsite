import { PAGES } from "../../data/navigation";
import Overlay from "../ui/Overlay";
import "./ContentsOverlay.css";

/* The Contents page: every page of the issue, huge, with its page number.
   It wipes down over the site like a page swap. Choosing an entry closes it
   and turns to that page. */
export default function ContentsOverlay({ onClose, onOpenPrintEdition }) {
  const turnTo = (requestClose, id) => (event) => {
    event.preventDefault();
    requestClose();
    // Wait for the exit wipe (and the scroll lock it releases) before turning.
    setTimeout(() => {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }, 340);
  };

  return (
    <Overlay label="Contents" onClose={onClose} panelClassName="contents-panel">
      {(requestClose) => (
        <div className="contents">
          <div className="contents__bar">
            <span className="contents__title">Contents</span>
            <button className="contents__close" onClick={requestClose}>Close</button>
          </div>
          <ol className="contents__list">
            {PAGES.map(({ id, no, title, blurb }, i) => (
              <li key={id} className="contents__item" style={{ "--i": i }}>
                <a className="contents__link" href={`#${id}`} onClick={turnTo(requestClose, id)}>
                  <span className="contents__no">{no}</span>
                  <span className="contents__name">{title}</span>
                  <span className="contents__blurb">{blurb}</span>
                </a>
              </li>
            ))}
          </ol>
          <button
            className="contents__print"
            onClick={() => {
              requestClose();
              setTimeout(onOpenPrintEdition, 340);
            }}
          >
            Read the print edition instead
          </button>
        </div>
      )}
    </Overlay>
  );
}
