import useInView from "../../hooks/useInView";
import "./Reveal.css";

/* Fades and lifts its children in the first time they scroll into view. */
export default function Reveal({ children }) {
  const [ref, inView] = useInView({ threshold: 0.08 });
  return (
    <div ref={ref} className={`reveal${inView ? " is-visible" : ""}`}>
      {children}
    </div>
  );
}
