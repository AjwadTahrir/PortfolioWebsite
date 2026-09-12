import { useCallback, useEffect, useRef, useState } from "react";

const PROJECT_PATH = /\/projects\/([^/]+)\/?$/;

/* Syncs the open project with the URL via the History API — no router.
   Gives bookmarkable /projects/<id> links, Back-button close and deep
   links. (Not per-project SEO: that would need pre-rendering.)

   `projectIds` can also arrive empty and fill in later (e.g. a CMS fetch
   that hasn't resolved on first render) — a deep link is re-checked once
   the list arrives, so it isn't missed just because it was empty at
   mount. */
export default function useProjectRoute(projectIds) {
  const base = import.meta.env.BASE_URL || "/"; // always ends with "/"

  const matchProjectId = useCallback(
    (pathname) => {
      const match = pathname.match(PROJECT_PATH);
      return match && projectIds.includes(match[1]) ? match[1] : null;
    },
    [projectIds]
  );

  const [activeId, setActiveId] = useState(() => matchProjectId(window.location.pathname));

  // True when *we* pushed the current history entry, so closing can pop it.
  const pushedEntry = useRef(false);

  const open = useCallback(
    (id) => {
      if (!projectIds.includes(id)) return;
      window.history.pushState({ projectId: id }, "", `${base}projects/${id}`);
      pushedEntry.current = true;
      setActiveId(id);
    },
    [base, projectIds]
  );

  const close = useCallback(() => {
    if (pushedEntry.current) {
      pushedEntry.current = false;
      window.history.back(); // popstate below clears activeId
    } else {
      // Arrived via deep link: nothing of ours to pop, so rewrite the URL in place.
      window.history.replaceState({}, "", base);
      setActiveId(null);
    }
  }, [base]);

  // Re-check the URL once `projectIds` fills in, for the deep-link-before-load case.
  useEffect(() => {
    if (activeId || pushedEntry.current) return;
    const matched = matchProjectId(window.location.pathname);
    if (matched) setActiveId(matched);
  }, [projectIds, activeId, matchProjectId]);

  useEffect(() => {
    const onPopState = () => {
      pushedEntry.current = false;
      setActiveId(matchProjectId(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [matchProjectId]);

  return { activeId, open, close };
}
