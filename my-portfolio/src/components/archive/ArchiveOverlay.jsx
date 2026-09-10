import React, { useEffect, useState } from "react";
import FieldNotesMap from "../features/FieldNotesMap";
import RunnersLog from "../features/RunnersLog";
import { ARCHIVE } from "../../data/archive";

export default function ArchiveOverlay({ activeId, onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (activeId) requestAnimationFrame(() => setShow(true));
    else setShow(false);
  }, [activeId]);

  if (!activeId) return null;
  const item = ARCHIVE.find((a) => a.id === activeId);

  return (
    <div className="feat-overlay" role="dialog" aria-modal="true">
      <div className={`feat-overlay__backdrop${show ? " show" : ""}`} onClick={onClose} />
      <div className={`feat-overlay__panel${show ? " show" : ""}`}>
        <div className="feat-overlay__bar">
          <span className="mono" style={{ letterSpacing: 2 }}>{item.kicker}</span>
          <button className="feat-overlay__close" onClick={onClose}>CLOSE ✕</button>
        </div>
        <div className="feat-overlay__head">
          <h2 className="headline" style={{ fontSize: "clamp(30px,4.5vw,56px)" }}>{item.title}</h2>
          <p className="body-p" style={{ marginTop: 10, fontSize: 16 }}>{item.dek}</p>
        </div>

        {activeId === "travel" && <FieldNotesMap />}
        {activeId === "running" && <RunnersLog />}
        {activeId === "university" && <div className="body-p">TODO — campus content</div>}
        {activeId === "photography" && <div className="body-p">TODO — photo grid</div>}
        {activeId === "life" && <div className="body-p">TODO — life content</div>}
      </div>
    </div>
  );
}