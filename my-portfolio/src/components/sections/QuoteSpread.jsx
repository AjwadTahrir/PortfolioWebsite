import Reveal from "../ui/Reveal";
import "./QuoteSpread.css";

/* Full-page pull quote between sections. */
export default function QuoteSpread({ quote, credit }) {
  return (
    <section className="quote-spread">
      <Reveal>
        <div className="wrap">
          <blockquote className="quote-spread__quote">{quote}</blockquote>
          <div className="quote-spread__credit mono">{credit}</div>
        </div>
      </Reveal>
    </section>
  );
}
