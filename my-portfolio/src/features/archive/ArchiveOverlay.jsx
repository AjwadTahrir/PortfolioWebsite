import { lazy, Suspense } from "react";
import Overlay from "../../components/ui/Overlay";
import PhotoSheet from "./PhotoSheet";
import CampusLife from "./CampusLife";
import LifeArchive from "./LifeArchive";
import RunnersLog from "./RunnersLog";

const FieldNotesMap = lazy(() => import("./FieldNotesMap"));

/* Tiles with a dedicated feature; the rest show their data `placeholder`.
   Photography shows its contact sheet as soon as it has photos. */
const CONTENT_BY_ID = {
  travel: FieldNotesMap,
  running: RunnersLog,
  university: CampusLife,
  life: LifeArchive,
};

export default function ArchiveOverlay({ item, onClose, morph }) {
  // An id-specific component always wins, even with zero photos (Life shows
  // placeholder frames rather than falling through to the plain PhotoSheet).
  const Content = CONTENT_BY_ID[item.id] ?? (item.photos?.length ? PhotoSheet : null);

  return (
    <Overlay label={item.title} onClose={onClose} morph={morph}>
      {(requestClose) => (
        <>
          <div className="overlay__bar">
            <span className="overlay__bar-label mono">{item.kicker}</span>
            <button className="overlay__close" onClick={requestClose}>CLOSE ✕</button>
          </div>
          <div className="overlay__head">
            <h2 className="headline archive-overlay__title">{item.title}</h2>
            <p className="body-p archive-overlay__dek">{item.dek}</p>
          </div>
          {Content ? (
            <Suspense fallback={<div className="body-p">Loading…</div>}>
              <Content item={item} />
            </Suspense>
          ) : (
            <div className="body-p">{item.placeholder}</div>
          )}
        </>
      )}
    </Overlay>
  );
}