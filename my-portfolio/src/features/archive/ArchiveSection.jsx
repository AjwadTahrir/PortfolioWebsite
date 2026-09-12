import { useState } from "react";
import StatusNote from "../../components/ui/StatusNote";
import Reveal from "../../components/ui/Reveal";
import useArchiveData from "../../hooks/cms/useArchiveData";
import ArchiveGrid from "./ArchiveGrid";
import ArchiveOverlay from "./ArchiveOverlay";
import "./archive.css";

/* "The Life Issue": bento grid of personal tiles, each opening an overlay.
   Tile content comes from Supabase; grid placement still comes from each
   tile's id in archive.css (see the note there). */
export default function ArchiveSection() {
  const { archive, loading, error } = useArchiveData();
  const [openItemId, setOpenItemId] = useState(null);
  const openItem = archive.find((item) => item.id === openItemId);

  return (
    <section id="archive" className="wrap archive">
      <Reveal>
        <div className="kicker">THE LIFE ISSUE</div>
        <div className="archive__grid-wrap">
          {archive.length ? (
            <ArchiveGrid items={archive} onOpen={setOpenItemId} />
          ) : (
            <StatusNote loading={loading} error={error} emptyLabel="NO ARCHIVE ITEMS YET" />
          )}
        </div>
      </Reveal>
      {openItem && <ArchiveOverlay item={openItem} onClose={() => setOpenItemId(null)} />}
    </section>
  );
}
