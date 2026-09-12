import Overlay from "../../components/ui/Overlay";
import FieldNotesMap from "./FieldNotesMap";
import RunnersLog from "./RunnersLog";

/* Tiles with a dedicated feature; the rest show their data `placeholder`. */
const CONTENT_BY_ID = {
  travel: FieldNotesMap,
  running: RunnersLog,
};

export default function ArchiveOverlay({ item, onClose }) {
  const Content = CONTENT_BY_ID[item.id];

  return (
    <Overlay label={item.title} onClose={onClose}>
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
          {Content ? <Content /> : <div className="body-p">{item.placeholder}</div>}
        </>
      )}
    </Overlay>
  );
}
