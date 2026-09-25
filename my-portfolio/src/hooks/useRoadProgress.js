import { useEffect } from "react";

const MARKER = 0.62; // the "you are here" line, as a share of the viewport height

/* Drives a scroll-linked route. On `ref.current` it writes:
     --road  0 to 1, how far the marker line has travelled down the block
     --path  the same, scaled by `pathScale` for routes whose length does not
             grow evenly with height (the winding road)
   and marks every `.road__stop` as `is-reached` once the marker passes it: by
   its `data-p` (a 0 to 1 position along the path) when it has one, otherwise
   by its position on screen. Under reduced motion the whole route is shown as
   travelled. */
export default function useRoadProgress(ref, { pathScale = 1 } = {}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const stops = [...node.querySelectorAll(".road__stop")];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--road", "1");
      node.style.setProperty("--path", "1");
      stops.forEach((stop) => stop.classList.add("is-reached"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * MARKER;
      const rect = node.getBoundingClientRect();
      const road = Math.max(0, Math.min(1, (marker - rect.top) / rect.height));
      const path = Math.min(1, road * pathScale);
      node.style.setProperty("--road", road.toFixed(4));
      node.style.setProperty("--path", path.toFixed(4));
      stops.forEach((stop) => {
        const p = stop.dataset.p;
        const reached = p !== undefined ? path >= Number(p) : stop.getBoundingClientRect().top < marker;
        stop.classList.toggle("is-reached", reached);
      });
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
  }, [ref, pathScale]);
}
