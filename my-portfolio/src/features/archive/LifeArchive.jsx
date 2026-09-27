/* The tags used for the honest placeholder frames shown until real photos
   exist. Purely structural — no fabricated caption or location goes with
   them. Real entries carry their own optional `tag` (see PhotosEditor). */
const PLACEHOLDER_TAGS = ["Running", "Travel", "Photography", "People", "Hackathons", "Everyday"];

function PlaceholderFrame({ tag }) {
  return (
    <div className="life__frame life__frame--empty">
      <span className="life__tag">{tag}</span>
      <span className="life__empty-note">Add a photo</span>
    </div>
  );
}

function Entry({ photo }) {
  if (photo.featured) {
    return (
      <figure className="life__frame life__frame--featured">
        <img className="life__img" src={photo.src} alt={photo.caption || photo.statLine || ""} loading="lazy" decoding="async" />
        <figcaption className="life__overlay-cap">
          {photo.tag && <span className="life__tag life__tag--on-image">{photo.tag}</span>}
          {photo.statLine && <span className="life__stat life__stat--on-image">{photo.statLine}</span>}
          {photo.caption && <span className="life__caption life__caption--on-image">{photo.caption}</span>}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="life__frame">
      <img className="life__img" src={photo.src} alt={photo.caption || photo.statLine || ""} loading="lazy" decoding="async" />
      <figcaption className="life__cap">
        {photo.tag && <span className="life__tag">{photo.tag}</span>}
        {photo.statLine && <span className="life__stat">{photo.statLine}</span>}
        {photo.caption && <span className="life__caption">{photo.caption}</span>}
      </figcaption>
    </figure>
  );
}

/* Life: a personal archive, not a résumé and not a travel gallery. A curated
   grid of photos (edited in /admin, Archive tab → Photos), each optionally
   tagged, captioned, and one at a time made a full-width featured moment.
   Until real photos exist, quiet placeholder frames hold the shape. */
export default function LifeArchive({ item }) {
  const photos = item.photos ?? [];

  return (
    <div className="life">
      {photos.length ? (
        <div className="life__grid">
          {photos.map((photo, i) => <Entry key={photo.src || i} photo={photo} />)}
        </div>
      ) : (
        <>
          <p className="body-p life__empty-lede">Nothing filed here yet — this is where it will live.</p>
          <div className="life__grid">
            {PLACEHOLDER_TAGS.map((tag) => <PlaceholderFrame key={tag} tag={tag} />)}
          </div>
        </>
      )}
    </div>
  );
}
