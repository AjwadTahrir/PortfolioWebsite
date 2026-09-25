import { useEffect } from "react";

const TRAVEL_VH = 0.4; // the cover finishes "closing" after this much scroll, in viewport heights

/* Writes --cover-p (0 at the top, 1 once the cover has played out) on `ref`
   from the scroll position. The cover, running head and margin strip read
   it in CSS, so only transforms and opacity move. Under reduced motion
   nothing is written and the stylesheet's static default (1) applies. */
export default function useCoverProgress(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * TRAVEL_VH)));
      node.style.setProperty("--cover-p", p.toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}
