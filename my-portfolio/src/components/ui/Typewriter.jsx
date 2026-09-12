import { Fragment, useEffect, useState } from "react";
import useInView from "../../hooks/useInView";
import "./Typewriter.css";

const JITTER_MS = 18; // random extra delay per character, for a human rhythm

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/* Types out `lines` (one per visual line) once scrolled into view.
   Screen readers get the full text immediately; with reduced motion the
   text appears in one go. */
export default function Typewriter({ lines, speed = 32, startDelay = 150 }) {
  const [ref, started] = useInView({ threshold: 0.4 });
  const [typedCount, setTypedCount] = useState(0);
  const fullText = lines.join("\n");
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!started || reducedMotion) return;
    let count = 0;
    let timer;
    const typeNext = () => {
      count += 1;
      setTypedCount(count);
      if (count < fullText.length) {
        const isSpace = fullText[count - 1] === " ";
        timer = setTimeout(typeNext, speed + (isSpace ? 0 : Math.random() * JITTER_MS));
      }
    };
    timer = setTimeout(typeNext, startDelay);
    return () => clearTimeout(timer);
  }, [started, reducedMotion, fullText, speed, startDelay]);

  const visibleText = started && reducedMotion ? fullText : fullText.slice(0, typedCount);
  const typedLines = visibleText.split("\n");

  return (
    <span ref={ref}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((_, i) => (
          <Fragment key={i}>
            {typedLines[i] ?? ""}
            {i < lines.length - 1 && <br />}
          </Fragment>
        ))}
        <span className="typewriter__caret" />
      </span>
    </span>
  );
}
