import "./Figure.css";

/* Bordered frame with a magazine-style "FIG. x.y — caption" line. */
export default function Figure({ no, caption, children }) {
  return (
    <figure className="figure">
      <div className="figure__frame">{children}</div>
      <figcaption className="figure__caption mono">
        <span className="figure__no">FIG. {no}</span> — {caption}
      </figcaption>
    </figure>
  );
}
