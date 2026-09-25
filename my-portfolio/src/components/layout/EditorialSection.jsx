import "./editorial.css";

/* A page of the back matter: one huge title, then the content. The page
   number lives in the margin strip (data/navigation.js), so there is no
   per-section furniture here. `className` carries the section's own layout. */
export default function EditorialSection({ id, title, deck, className = "", children }) {
  return (
    <section id={id} className={`wrap page snap-page ${className}`}>
      <header className="page__head">
        <h2 className="headline headline--section">{title}</h2>
        {deck && <p className="page__deck">{deck}</p>}
      </header>
      {children}
    </section>
  );
}
