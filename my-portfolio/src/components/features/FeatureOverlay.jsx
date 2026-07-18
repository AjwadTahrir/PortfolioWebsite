import React, { useEffect, useState, useRef } from "react";
import { INK, GREY } from "../../constants/colors";
import FeatureArticle from "../article/FeatureArticle";

/* The "open the issue" overlay. Renders the full article over a blurred
   backdrop. Enter animation on mount; ESC / backdrop / close button play
   the exit animation, then call onClose (which the route hook turns into a
   browser-history step so Back closes it too). */
export default function FeatureOverlay({ project, onClose }) {
  const [show, setShow] = useState(false);
  const panelRef = useRef(null);
  const closingRef = useRef(false);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  // enter animation + body scroll lock
  useEffect(() => {
    if (!project) return;
    closingRef.current = false;
    const raf = requestAnimationFrame(() => setShow(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (panelRef.current) panelRef.current.scrollTop = 0;
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [project]);

  // ESC to close
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === "Escape") requestClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;
  const p = project;

  return (
    <div className="feat-overlay" role="dialog" aria-modal="true" aria-label={`${p.name} — feature`}>
      <div className={`feat-overlay__backdrop${show ? " show" : ""}`} onClick={requestClose} />
      <div ref={panelRef} className={`feat-overlay__panel${show ? " show" : ""}`}>
        <div className="feat-overlay__bar">
          <span className="mono" style={{ color: GREY, letterSpacing: 2 }}>ISSUE 01 · PAGE {p.no}</span>
          <button className="feat-overlay__close mono" onClick={requestClose} aria-label="Close">CLOSE ✕</button>
        </div>
        <div className="feat-overlay__head">
          <div className="kicker">{p.kicker}</div>
          <h2 className="headline" style={{ fontSize: "clamp(32px,5vw,64px)", marginTop: 8 }}>{p.name}</h2>
          <p style={{ color: GREY, fontSize: 17, lineHeight: 1.55, margin: "12px 0 0", maxWidth: 720 }}>{p.dek}</p>
          <div className="rule-thick" style={{ marginTop: 22 }} />
        </div>
        <FeatureArticle p={p} />
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: INK, opacity: 0.5, paddingTop: 24, letterSpacing: 1 }}>
          <span>AJWAD TAHRIR · ISSUE 01</span>
          <button className="feat-overlay__close mono" onClick={requestClose} style={{ opacity: 1 }}>← BACK TO CONTENTS</button>
        </div>
      </div>
    </div>
  );
}
