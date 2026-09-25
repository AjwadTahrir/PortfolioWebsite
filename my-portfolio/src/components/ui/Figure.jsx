import "./Figure.css";

/* Bordered frame with a magazine-style "Fig. x.y caption" line. */
export default function Figure({ no, caption, children }) {
  return (
    <figure className="figure">
      <div className="figure__frame">{children}</div>
      <figcaption className="figure__caption">
        <span className="figure__no">Fig. {no}</span> {caption}
      </figcaption>
    </figure>
  );
}
