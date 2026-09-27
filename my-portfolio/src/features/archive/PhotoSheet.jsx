import { useState } from "react";

/* The Photography overlay: a contact sheet of the item's photos, each with a
   caption, and a large view with previous / next. Photos are edited in
   /admin (Archive tab) and stored as `photos: [{ src, caption }]`. */
export default function PhotoSheet({ item }) {
  const photos = item.photos ?? [];
  const [openIndex, setOpenIndex] = useState(null);

  if (openIndex !== null && photos[openIndex]) {
    const photo = photos[openIndex];
    const step = (by) => setOpenIndex((openIndex + by + photos.length) % photos.length);
    return (
      <div className="viewer">
        <img className="viewer__img" src={photo.src} alt={photo.caption || `${item.title}, photo ${openIndex + 1}`} />
        <div className="viewer__bar">
          <p className="viewer__cap">{photo.caption} <span className="mono">{openIndex + 1} / {photos.length}</span></p>
          <div className="viewer__nav">
            <button className="viewer__btn" onClick={() => setOpenIndex(null)}>All photos</button>
            {photos.length > 1 && (
              <>
                <button className="viewer__btn" onClick={() => step(-1)} aria-label="Previous photo">Previous</button>
                <button className="viewer__btn" onClick={() => step(1)} aria-label="Next photo">Next</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet">
      {photos.map((photo, i) => (
        <figure key={photo.src} className="sheet__frame">
          <button className="sheet__open" onClick={() => setOpenIndex(i)} aria-label={`Open photo: ${photo.caption || i + 1}`}>
            <img className="sheet__img" src={photo.src} alt={photo.caption || ""} loading="lazy" decoding="async" />
          </button>
          {photo.caption && <figcaption className="sheet__cap">{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
