import { useState } from "react";
import { flushSync } from "react-dom";
import StatusNote from "../../components/ui/StatusNote";
import useArchiveData from "../../hooks/cms/useArchiveData";
import ArchiveGrid from "./ArchiveGrid";
import ArchiveOverlay from "./ArchiveOverlay";
import "./archive.css";

const MORPH_NAME = "archive-morph"; // matches the view-transition rules in archive.css

/* Runs `update` inside a View Transition where the tile and the overlay
   panel share MORPH_NAME, so one visibly becomes the other. Browsers
   without the API (or with reduced motion) just get the plain update. */
function morph(update, { from, to }) {
  const canMorph =
    document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canMorph) {
    update();
    return;
  }
  if (from) from.style.viewTransitionName = MORPH_NAME;
  const transition = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = "";
    flushSync(update);
    const target = to?.();
    if (target) target.style.viewTransitionName = MORPH_NAME;
  });
  transition.finished.finally(() => {
    const target = to?.();
    if (target) target.style.viewTransitionName = "";
  });
}

/* The archive: a dark page straight after the profile (it belongs to the
   profile's page number). Tile content comes from Supabase; the layout rows
   live in ArchiveGrid. */
export default function ArchiveSection() {
  const { archive, loading, error } = useArchiveData();
  const [openItemId, setOpenItemId] = useState(null);
  const openItem = archive.find((item) => item.id === openItemId);

  const open = (id, tile) => morph(() => setOpenItemId(id), { from: tile });
  const close = () =>
    morph(() => setOpenItemId(null), {
      to: () => document.querySelector(`.archive-tile--${openItemId}`),
    });

  return (
    <section id="archive" className="archive snap-page">
      <header className="archive__head">
        <h2 className="archive__title headline">The Archive</h2>
        <p className="archive__deck">Five things that happen away from the keyboard. Open any of them.</p>
      </header>
      {archive.length ? (
        <ArchiveGrid items={archive} onOpen={open} />
      ) : (
        <StatusNote loading={loading} error={error} emptyLabel="NO ARCHIVE ITEMS YET" />
      )}
      {openItem && <ArchiveOverlay item={openItem} onClose={close} morph />}
    </section>
  );
}
