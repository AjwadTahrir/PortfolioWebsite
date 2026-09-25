import { useEffect, useState } from "react";

const SEEN_KEY = "issue-opened";
const OPENING_MS = 2200; // keep in sync with the sequence in cover.css

/* True while the cover's opening sequence plays. Once per session, never
   under reduced motion; afterwards the cover is simply in its final state,
   so the CSS animations only exist under the returned flag. */
export default function useOpening() {
  const [isOpening, setIsOpening] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!isOpening) return;
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked: it just plays again */ }
    const timer = setTimeout(() => setIsOpening(false), OPENING_MS);
    return () => clearTimeout(timer);
  }, [isOpening]);

  return isOpening;
}
