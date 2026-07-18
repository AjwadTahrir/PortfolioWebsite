import { useState, useEffect, useRef, useCallback } from "react";

/* Syncs the open project to the URL with the History API — no router, no
   dependency. Gives bookmarkable /projects/<id> links, Back-button close,
   and working deep links. (It does NOT give search-engine indexing of each
   project — that needs pre-rendering, a separate decision.)

   Also listens for the existing `open-article` event (newswire ticker) so
   those clicks open the overlay too. */
export default function useProjectRoute(projects) {
  const ids = projects.map((p) => p.id);
  const base = import.meta.env.BASE_URL || "/"; // ends with "/"

  const parse = (path) => {
    const m = path.match(/\/projects\/([^/]+)\/?$/);
    return m && ids.includes(m[1]) ? m[1] : null;
  };

  const [activeId, setActiveId] = useState(() =>
    typeof window !== "undefined" ? parse(window.location.pathname) : null
  );
  const didPush = useRef(false);

  const open = useCallback((id) => {
    if (!ids.includes(id)) return;
    window.history.pushState({ projectId: id }, "", `${base}projects/${id}`);
    didPush.current = true;
    setActiveId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, ids.join(",")]);

  const close = useCallback(() => {
    if (didPush.current) {
      didPush.current = false;
      window.history.back(); // pops our entry -> popstate clears activeId
    } else {
      // deep-linked straight to a project: no entry to pop, so replace with base
      window.history.pushState({}, "", base);
      setActiveId(null);
    }
  }, [base]);

  useEffect(() => {
    const onPop = () => {
      didPush.current = false;
      setActiveId(parse(window.location.pathname));
    };
    const onOpenArticle = (e) => open(e.detail);
    window.addEventListener("popstate", onPop);
    window.addEventListener("open-article", onOpenArticle);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("open-article", onOpenArticle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return { activeId, open, close };
}
