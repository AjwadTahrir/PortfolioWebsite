import { useEffect, useState } from "react";

/* Scroll-spy: returns the id of the section currently in the reading band
   (roughly the upper-middle of the viewport). `ids` must be stable. */
export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
