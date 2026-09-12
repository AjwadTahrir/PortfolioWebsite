import "./visuals.css";

/* Vertical box-and-arrow flow; the final step is drawn inverted. */
export default function PipelineDiagram({ title, steps }) {
  return (
    <div className="pipeline">
      <div className="pipeline__title mono">{title}</div>
      {steps.map((step, i) => (
        <div key={step} className="pipeline__step">
          <div className="pipeline__box">{step}</div>
          {i < steps.length - 1 && <div className="pipeline__arrow" aria-hidden="true">↓</div>}
        </div>
      ))}
    </div>
  );
}
