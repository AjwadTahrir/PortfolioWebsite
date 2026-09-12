import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Overlay.css";

const EXIT_DURATION_MS = 300; // keep in sync with the transitions in Overlay.css
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* Modal dialog shell shared by project stories and archive tiles.
   Mount it only while open. Handles the enter/exit animation, Escape,
   backdrop click, body scroll lock, and focus (moved in, trapped, and
   returned to the trigger on close).

   `children` is a render function receiving `requestClose`, so the
   content's own close buttons play the exit animation too. */
export default function Overlay({ label, onClose, children }) {
  const [isShown, setIsShown] = useState(false);
  const panelRef = useRef(null);
  const exitTimer = useRef(null);

  const requestClose = useCallback(() => {
    if (exitTimer.current) return;
    setIsShown(false);
    exitTimer.current = setTimeout(onClose, EXIT_DURATION_MS);
  }, [onClose]);

  // Enter animation, scroll lock, focus in/out.
  useEffect(() => {
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => setIsShown(true));

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer.current);
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.({ preventScroll: true });
    };
  }, []);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || current === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const shownClass = isShown ? " is-shown" : "";

  return createPortal(
    <div className="overlay" role="dialog" aria-modal="true" aria-label={label}>
      <div className={`overlay__backdrop${shownClass}`} onClick={requestClose} />
      <div ref={panelRef} className={`overlay__panel${shownClass}`} tabIndex={-1}>
        {children(requestClose)}
      </div>
    </div>,
    document.body
  );
}
