import { useEffect, useState } from "react";
import "./layout.css";

/* Hairline reading-progress bar pinned to the top of the viewport. */
export default function ProgressRule() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setProgress(doc.scrollTop / (doc.scrollHeight - doc.clientHeight) || 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="progress-rule" aria-hidden="true">
      <div className="progress-rule__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
