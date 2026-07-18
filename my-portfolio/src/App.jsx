import React, { useState, useEffect, useRef } from "react";
import { INK, PAPER, RED, GREY, FAINT } from "./constants/colors";
import SatelliteView from "./components/visuals/SatelliteView";
import Fig from "./components/common/Fig";
import FeatureGrid from "./components/features/FeatureGrid";
import FeatureOverlay from "./components/features/FeatureOverlay";
import useProjectRoute from "./hooks/useProjectRoute";
import { PROJECTS } from "./data/projects";
import { STATS } from "./data/stats";
import { ERAS } from "./data/eras";
import { REPORTS } from "./data/reports";
import { NEWSWIRE } from "./data/newswire";
import { TOC_ITEMS, TOC_IDS } from "./data/toc";
import { SKILLS } from "./data/skills";

/* ------------------------------------------------------------------
   AJWAD — THE SOFTWARE ENGINEER ISSUE (v5)
   "The first issue of an engineer's career magazine."

   Data lives in ./data, visual components in ./components/visuals,
   colour tokens in ./constants/colors. This file holds the layout
   primitives and the page composition only.
------------------------------------------------------------------- */

/* ================= PRIMITIVES ==================================== */

function ProgressRule() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement;
      setW((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100 }}>
      <div style={{ height: "100%", width: `${w}%`, background: INK, transition: "width .1s linear" }} />
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(22px)", transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.2,.7,.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* Types out `lines` (array of strings, one per <br/>-separated line) once
   scrolled into view. Respects prefers-reduced-motion by rendering instantly. */
function Typewriter({ lines, speed = 32, startDelay = 150, className, style }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [out, setOut] = useState(() => lines.map(() => ""));
  const [showCaret, setShowCaret] = useState(true);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setOut(lines);
      setShowCaret(false);
      return;
    }
    let cancelled = false;
    const full = lines.join("\n");
    let i = 0;
    const timer = setTimeout(function tick() {
      if (cancelled) return;
      i++;
      const sliced = full.slice(0, i);
      setOut(sliced.split("\n").concat(Array(lines.length).fill("")).slice(0, lines.length));
      if (i < full.length) {
        setTimeout(tick, speed + (full[i - 1] === " " ? 0 : Math.random() * 18));
      } else {
        setShowCaret(true);
      }
    }, startDelay);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <span ref={ref} className={className} style={style}>
      {out.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < out.length - 1 && <br />}
        </React.Fragment>
      ))}
      <span style={{ display: "inline-block", width: "0.06em", borderRight: `3px solid ${INK}`, marginLeft: 3, animation: showCaret ? "caretBlink 1s steps(1) infinite" : "none", opacity: out.join("").length >= lines.join("\n").length ? 1 : 1 }} />
    </span>
  );
}

/* Tracks which section id is currently in view and returns it, for scroll-spy TOC */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function PageFoot({ no }) {
  return (
    <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: FAINT, paddingTop: 40, letterSpacing: 1 }}>
      <span>AJWAD TAHRIR · ISSUE 01</span>
      <span>PAGE {no}</span>
    </div>
  );
}

function QuoteSpread({ children, credit }) {
  return (
    <section className="quote-spread" style={{ textAlign: "center" }}>
      <Reveal>
        <div className="wrap">
          <blockquote style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: "clamp(28px,4.5vw,58px)", lineHeight: 1.25, margin: "0 auto", maxWidth: 900, color: INK }}>
            {children}
          </blockquote>
          <div className="mono" style={{ color: GREY, marginTop: 28, letterSpacing: 3 }}>{credit}</div>
        </div>
      </Reveal>
    </section>
  );
}

/* Newswire ticker: micro-headlines from the issue; pauses on hover, click to jump to the article */
function Newswire() {
  const loop = [...NEWSWIRE, ...NEWSWIRE];
  const go = (id) => {
    window.dispatchEvent(new CustomEvent("open-article", { detail: id }));
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="ticker-shell" style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, overflow: "hidden", whiteSpace: "nowrap", background: INK, color: PAPER }}>
      <div className="ticker-track mono">
        {loop.map(([headline, id], i) => (
          <button
            key={`${i}`}
            className="ticker-item"
            onClick={() => go(id)}
            tabIndex={i < NEWSWIRE.length ? 0 : -1}
            aria-hidden={i >= NEWSWIRE.length}
          >
            {headline}
            <span style={{ color: RED, margin: "0 16px" }}>+++</span>
          </button>
        ))}
      </div>
      <div className="mono ticker-hint">CLICK A HEADLINE TO READ THE STORY ↓</div>
    </div>
  );
}

function SkillIndex({ sel, setSel }) {
  return (
    <div className="skill-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 50, marginTop: 30, alignItems: "start" }}>
      <div>
        {SKILLS.map((s) => {
          const active = sel.name === s.name;
          return (
            <button
              key={s.name}
              onMouseEnter={() => setSel(s)}
              onFocus={() => setSel(s)}
              onClick={() => setSel(s)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16,
                width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                padding: "10px 0", borderBottom: `1px dotted ${FAINT}`, fontFamily: "inherit",
              }}
            >
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: active ? 900 : 600, fontSize: "clamp(19px,2.2vw,27px)", color: active ? RED : INK, transition: "color .15s ease" }}>
                {s.name}
              </span>
              <span className="mono" style={{ color: active ? RED : FAINT, whiteSpace: "nowrap" }}>
                {s.cat} {active ? "←" : ""}
              </span>
            </button>
          );
        })}
      </div>
      <div className="skill-dossier" style={{ position: "sticky", top: 76, border: `1px solid ${INK}`, background: "#FDFCFA", padding: "26px 28px", minHeight: 260 }}>
        <div className="mono" style={{ color: RED, letterSpacing: 2 }}>{sel.cat} · SINCE {sel.since}</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,44px)", margin: "10px 0 12px" }}>{sel.name}</div>
        <p className="body-p" style={{ fontSize: 15.5, lineHeight: 1.7 }}>{sel.note}</p>
        <div className="mono" style={{ color: GREY, letterSpacing: 2, marginTop: 20, marginBottom: 8 }}>APPEARS IN THIS ISSUE</div>
        {sel.projects.length ? (
          sel.projects.map((p) => (
            <div key={p} style={{ display: "flex", gap: 10, padding: "5px 0", fontSize: 14.5 }}>
              <span style={{ color: RED }}>→</span><span style={{ fontWeight: 700 }}>{p}</span>
            </div>
          ))
        ) : (
          <div className="mono" style={{ color: FAINT }}>OFF THE RECORD — COURSEWORK & SIDE BUILDS</div>
        )}
      </div>
    </div>
  );
}

/* Sticky running-header nav, magazine style */
function NavBar({ items, active }) {
  return (
    <nav className="navbar">
      <div className="wrap navbar-inner">
        <span className="mono navbar-brand">AJWAD TAHRIR · ISSUE 01</span>
        <div className="navbar-links">
          {items.map(([id, label, no]) => (
            <a key={id} href={`#${id}`} className={`navbar-link${active === id ? " active" : ""}`}>
              <span className="navbar-no">{no}</span> <span className="navbar-label">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* Page-turn divider between major sections */
function SectionBreak({ no, label }) {
  return (
    <div className="wrap" aria-hidden="true" style={{ paddingTop: 30, paddingBottom: 10 }}>
      <div className="rule-thick" />
      <Reveal>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "18px 0 6px", overflow: "hidden" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(70px,11vw,170px)", lineHeight: 0.85, color: INK, opacity: 0.08, userSelect: "none" }}>
            {no}
          </span>
          <span className="mono" style={{ letterSpacing: 4, color: GREY, textAlign: "right" }}>{label}</span>
        </div>
      </Reveal>
      <div className="rule" />
    </div>
  );
}

/* ================= PAGE ========================================== */

export default function Portfolio() {
  const [printMode, setPrintMode] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const activeSection = useActiveSection(TOC_IDS);
  const [skill, setSkill] = useState(SKILLS[0]);
  const route = useProjectRoute(PROJECTS);
  const activeProject = PROJECTS.find((p) => p.id === route.activeId) || null;

  if (printMode) {
    return (
      <div style={{ background: "#E8E4DC", minHeight: "100vh", fontFamily: "'Archivo',sans-serif", color: INK, padding: "30px 12px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Archivo:wght@400;500;700&family=Space+Mono&display=swap');
          .mono { font-family:'Space Mono',monospace; font-size: 11px; }
          .print-sheet { max-width: 800px; margin: 0 auto; padding: 44px 38px; background:#fff; box-shadow: 0 4px 30px rgba(20,20,20,.15); }
          .print-cols { column-count: 2; column-gap: 28px; column-rule: 1px solid #DDD8CF; }
          .print-article { break-inside: avoid; margin-bottom: 20px; }
          @media (max-width: 640px){ .print-cols { column-count: 1; } }
          @media print { .print-close { display:none !important; } .print-sheet { box-shadow:none; padding:0; } body{ background:#fff; } .print-cover { break-after: page; margin-bottom: 0 !important; } }
        `}</style>
        <div className="print-close" style={{ maxWidth: 800, margin: "0 auto 14px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setPrintMode(false)} style={{ border: `1px solid ${INK}`, background: "none", fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
            ← BACK TO WEB EDITION
          </button>
          <button onClick={() => window.print()} style={{ border: "none", background: INK, color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
            PRINT / SAVE PDF ⎙
          </button>
        </div>
        {/* COVER PAGE — drop your composed cover at /public/cover.png */}
        <div className="print-sheet print-cover" style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <img
            src="/cover.PNG"
            alt="AJWAD — The Software Engineer Issue, Vol. 01 cover"
            style={{ width: "100%", display: "block" }}
            onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          />
        </div>
        <div className="print-sheet">
          <div style={{ display: "flex", justifyContent: "space-between" }} className="mono">
            <span>PRINT EDITION</span>
            <span>{now.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div style={{ borderTop: `3px solid ${INK}`, margin: "8px 0 4px" }} />
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 46, margin: "4px 0", textAlign: "center", letterSpacing: -1 }}>AJWAD TAHRIR</h1>
          <div className="mono" style={{ textAlign: "center", paddingBottom: 8 }}>
            SOFTWARE ENGINEERING · UNIVERSITI MALAYA · FULL-STACK & ML · github.com/AjwadTahrir
          </div>
          <div style={{ borderTop: `1px solid ${INK}`, marginBottom: 20 }} />
          <div className="print-cols">
            {PROJECTS.map((p) => (
              <div key={p.id} className="print-article">
                <div className="mono" style={{ letterSpacing: 1, color: GREY }}>{p.kicker}</div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 22, margin: "4px 0 6px" }}>{p.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 6px" }}>{p.tech} {p.impact}</p>
                <div className="mono" style={{ color: GREY }}>{p.stack.join(" · ")} — {p.year}</div>
              </div>
            ))}
            <div className="print-article">
              <div className="mono" style={{ letterSpacing: 1, color: GREY }}>FIELD REPORTS</div>
              {REPORTS.map(([title, items]) => (
                <div key={title} style={{ padding: "6px 0", borderBottom: "1px dotted #CCC7BE" }}>
                  <b style={{ fontSize: 12 }}>{title}</b>
                  {items.map((it) => <div key={it} style={{ fontSize: 12 }}>✓ {it}</div>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `3px solid ${INK}`, marginTop: 12, paddingTop: 8, display: "flex", justifyContent: "space-between" }} className="mono">
            <span>CONTACT: hello@example.com</span>
            <span>© {now.getFullYear()} AJWAD TAHRIR</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh", fontFamily: "'Archivo',sans-serif", position: "relative" }}>
      {/* paper grain — nearly imperceptible */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 90, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Archivo:wght@400;500;700&family=Space+Mono&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        section[id], main[id] { scroll-margin-top: 56px; }
        .wrap { max-width: 1900px; margin: 0 auto; padding: 0 clamp(20px, 2.5vw, 40px); }
        .rule { border-top: 1px solid ${INK}; }
        .rule-thick { border-top: 3px solid ${INK}; }
        .kicker { font-family:'Space Mono',monospace; font-size: 11px; letter-spacing: 2px; color:${RED}; }
        .mono { font-family:'Space Mono',monospace; font-size: 12px; }
        .headline { font-family:'Fraunces',serif; font-weight:900; line-height:1.02; margin:0; color:${INK}; transition: color .25s ease; }
        .masthead-title {
          font-family: 'Fraunces', serif !important;
          font-weight: 900 !important;
          font-size: clamp(42px,10vw,120px) !important;
          line-height: 0.95 !important;
          margin: 6px 0 16px !important;
          letter-spacing: -2px !important;
          text-align: center !important;
          color: ${INK} !important;
        }
        .article-row { display:grid; grid-template-columns: 70px 1fr 200px; gap: 24px; cursor:pointer; }
        .article-row:hover .headline { color:${RED}; }
        .article-row:focus-visible { outline: 3px solid ${INK}; outline-offset: 4px; }
        .no { font-family:'Fraunces',serif; font-weight:900; color:#D8D4CC; }
        .spread { overflow:hidden; transition: max-height .7s cubic-bezier(.4,0,.2,1), opacity .5s ease; }
        .spread-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .frames-row { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; align-items: stretch; }
        .section-h { font-family:'Space Mono',monospace; font-size: 12px; letter-spacing: 2px; color:${GREY}; margin: 18px 0 6px; }
        .body-p { font-size: 15.5px; line-height: 1.7; margin: 0; color:${INK}; }
        .pull { font-family:'Fraunces',serif; font-weight:600; font-size: clamp(20px,3vw,26px); line-height:1.35;
          border-left: 3px solid ${INK}; margin: 26px 0; padding-left: 20px; }
        .cta { display:inline-block; background:${RED}; color:#fff; padding: 12px 24px; font-weight:700;
          text-decoration:none; font-size:14px; }
        .cta:hover { background:${INK}; }
        .cta-ghost { display:inline-block; border:2px solid ${PAPER}; color:${PAPER}; padding: 12px 24px;
          font-weight:700; text-decoration:none; font-size:14px; text-align:center; }
        .cta-ghost:hover { background:${PAPER}; color:${INK}; }
        .print-btn { background:none; border:1px solid ${INK}; font-family:'Space Mono',monospace;
          font-size:11px; letter-spacing:1px; padding:5px 12px; cursor:pointer; color:${INK}; }
        .print-btn:hover { background:${INK}; color:${PAPER}; }
        .stat { padding: 26px 22px; border-left: 1px solid ${INK}; }
        .stat:first-child { border-left: none; }
        .log-item { display:grid; grid-template-columns: 110px 1fr; gap: 24px; padding: 20px 0; border-bottom: 1px solid ${FAINT}; }
        .report { border: 1px solid ${INK}; padding: 22px; background: #FDFCFA; }
        .stamp { display:inline-block; border: 2px solid ${INK}; padding: 6px 14px; font-family:'Space Mono',monospace;
          font-size: 12px; letter-spacing: 1px; transform: rotate(-2deg); }
        @media (max-width: 860px){
          .spread-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stat { border-left:none !important; border-top: 1px solid ${INK}; }
          .reports-grid { grid-template-columns: 1fr !important; }
          .profile-grid { grid-template-columns: 200px 1fr !important; }
          .profile-grid > div:last-child { grid-column: 1 / -1; }
          .skill-grid { grid-template-columns: 1fr !important; }
          .skill-dossier { position: static !important; }
          .letter-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .letter-grid > div:last-child { border-left: none !important; padding-left: 0 !important; }
          .decisions-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px){
          .article-row { grid-template-columns: 48px 1fr; }
          .article-side { display:none; }
          .cover-grid { grid-template-columns: 1fr !important; }
          .log-item { grid-template-columns: 70px 1fr; }
          .era-grid { grid-template-columns: 84px 20px 1fr !important; }
          .profile-grid { grid-template-columns: 1fr !important; }
          .profile-grid figure { max-width: 220px; }

          /* nav: numbers only, bigger tap targets */
          .navbar-label { display: none; }
          .navbar-link { padding: 10px 12px; font-size: 13px; }
          .navbar-no { color: ${INK}; font-weight: 700; }
          .navbar-link.active .navbar-no { color: ${RED}; }
          .navbar-links { margin-left: 0; width: 100%; justify-content: space-between; }

          /* masthead: drop date, keep essentials */
          .masthead-meta-date { display: none; }
          .masthead-title { letter-spacing: -1px !important; }

          /* article spreads breathe less on small screens */
          .frames-row { grid-template-columns: 1fr !important; }
          .pull { font-size: 19px; padding-left: 14px; }

          /* era ghost years scaled down so they don't dominate */
          .era-ghost { font-size: 96px !important; opacity: 0.06 !important; }

          /* quote spreads shorter on mobile */
          .quote-spread { padding: 9vh 0 !important; }
        }
        @media (prefers-reduced-motion: reduce){ *{ transition:none !important; animation:none !important; } html{ scroll-behavior:auto; } }
        @keyframes ticker { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        @keyframes caretBlink { 50% { opacity: 0; } }
        .ticker-shell { position: relative; }
        .quote-spread { padding: 16vh 0; }
        .ticker-track { display: inline-block; padding: 8px 0; animation: ticker 60s linear infinite; }
        .ticker-shell:hover .ticker-track { animation-play-state: paused; }
        .ticker-item { background: none; border: none; color: ${PAPER}; font-family: 'Space Mono', monospace;
          font-size: 12px; cursor: pointer; padding: 4px 0; letter-spacing: 0.5px; }
        .ticker-item:hover { color: ${RED}; text-decoration: underline; text-underline-offset: 3px; }
        .ticker-hint { position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: ${INK}; color: #9B968D; padding: 4px 10px; font-size: 10px; letter-spacing: 1px;
          opacity: 0; transition: opacity .2s ease; pointer-events: none; }
        .ticker-shell:hover .ticker-hint { opacity: 1; }
        .navbar { position: sticky; top: 0; z-index: 95; background: ${PAPER}; border-bottom: 1px solid ${INK}; }
        .navbar-inner { display: flex; align-items: center; gap: 28px; padding-top: 10px; padding-bottom: 10px; }
        .navbar-brand { letter-spacing: 2px; color: ${GREY}; white-space: nowrap; }
        .navbar-links { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; margin-left: auto; }
        .navbar-links::-webkit-scrollbar { display: none; }
        .navbar-link { font-family:'Space Mono',monospace; font-size: 11.5px; letter-spacing: 0.5px;
          color: ${INK}; text-decoration: none; padding: 6px 10px; white-space: nowrap; border-bottom: 2px solid transparent; }
        .navbar-link:hover { color: ${RED}; }
        .navbar-link.active { color: ${RED}; border-bottom-color: ${RED}; }
        .navbar-no { color: ${FAINT}; }
        .navbar-link.active .navbar-no { color: ${RED}; }
        @media (max-width: 900px){ .navbar-brand { display: none; } }

        /* ---- Features: layout engine grid ---- */
        .feat-section { padding-top: 40px; }
        .feat-section__head { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .feat-section__label { color: ${RED}; letter-spacing: 3px; white-space: nowrap; }
        .feat-section__rule { flex: 1; border-top: 1px solid ${INK}; }
        .feat-section__count { color: ${FAINT}; white-space: nowrap; }
        .feat-grid { display: grid; gap: 18px; }
        .feat-grid--cover { grid-template-columns: 1fr; }
        .feat-grid--features { grid-template-columns: repeat(2, 1fr); }
        .feat-grid--notes { grid-template-columns: repeat(3, 1fr); }

        /* ---- Features: tiles ---- */
        .feat-tile { position: relative; display: flex; flex-direction: column; text-align: left;
          border: 1px solid ${INK}; background: #FDFCFA; cursor: pointer; padding: 0;
          font-family: inherit; color: ${INK}; overflow: hidden;
          transition: transform .18s ease, box-shadow .18s ease; }
        .feat-tile:hover { transform: translateY(-3px); box-shadow: 6px 8px 0 ${INK}; }
        .feat-tile:focus-visible { outline: 3px solid ${INK}; outline-offset: 3px; }
        .feat-tile__visual { border-bottom: 1px solid ${INK}; overflow: hidden; }
        .feat-tile--cover .feat-tile__visual { max-height: 360px; }
        .feat-tile--feature .feat-tile__visual { max-height: 220px; }
        .feat-tile__body { display: flex; flex-direction: column; gap: 10px; padding: 20px 22px; flex: 1; }
        .feat-tile__label { color: ${RED}; }
        .feat-tile__name { font-family: 'Fraunces', serif; font-weight: 900; line-height: 1.04; margin: 0;
          transition: color .15s ease; }
        .feat-tile:hover .feat-tile__name { color: ${RED}; }
        .feat-tile__dek { color: ${GREY}; font-size: 14.5px; line-height: 1.55; margin: 0; max-width: 560px; }
        .feat-tile--note { background: ${PAPER}; }
        .feat-tile__foot { margin-top: auto; padding-top: 8px; display: flex; flex-direction: column; gap: 8px; }
        .feat-tile__stack { color: ${GREY}; font-size: 11px; letter-spacing: .3px; }
        .feat-tile__meta { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dotted ${FAINT}; padding-top: 10px; }
        .feat-tile__cta { color: ${FAINT}; transition: color .15s ease; }
        .feat-tile:hover .feat-tile__cta { color: ${RED}; }

        @media (max-width: 900px){
          .feat-grid--notes { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px){
          .feat-grid--features, .feat-grid--notes { grid-template-columns: 1fr; }
        }

        /* ---- Features: overlay ---- */
        .feat-overlay { position: fixed; inset: 0; z-index: 200; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .feat-overlay__backdrop { position: fixed; inset: 0; background: rgba(20,20,20,0.55);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0;
          transition: opacity .3s ease; }
        .feat-overlay__backdrop.show { opacity: 1; }
        .feat-overlay__panel { position: relative; z-index: 1; width: min(1080px, 94vw);
          margin: 5vh auto 8vh; background: ${PAPER}; color: ${INK}; border: 1px solid ${INK};
          box-shadow: 0 30px 90px rgba(20,20,20,.35); padding: clamp(20px, 3vw, 40px);
          opacity: 0; transform: translateY(34px) scale(.985);
          transition: opacity .32s ease, transform .32s cubic-bezier(.2,.7,.3,1); }
        .feat-overlay__panel.show { opacity: 1; transform: none; }
        .feat-overlay__bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .feat-overlay__head { margin-bottom: 22px; }
        .feat-overlay__close { background: none; border: 1px solid ${INK}; color: ${INK};
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px;
          padding: 6px 12px; cursor: pointer; }
        .feat-overlay__close:hover { background: ${INK}; color: ${PAPER}; }
        @media (prefers-reduced-motion: reduce){
          .feat-overlay__backdrop, .feat-overlay__panel { transition: none; }
          .feat-overlay__panel { transform: none; }
        }
      `}</style>

      <ProgressRule />

      {/* MASTHEAD / COVER */}
      <header className="wrap" style={{ paddingTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span className="mono" style={{ color: GREY }}>VOL. 01</span>
          <span className="mono masthead-meta-date" style={{ color: GREY }}>{now.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}</span>
          <span className="mono" style={{ display: "flex", gap: 12, alignItems: "center", color: GREY }}>
            KUALA LUMPUR
            <button className="print-btn" onClick={() => setPrintMode(true)}>PRINT EDITION ⎙</button>
          </span>
        </div>
        <div className="rule-thick" style={{ margin: "10px 0 0" }} />
        <h1 className="masthead-title">
          AJWAD TAHRIR
        </h1>
        <div className="mono" style={{ textAlign: "center", letterSpacing: 4, paddingBottom: 10 }}>
          THE SOFTWARE ENGINEER ISSUE
        </div>
        <div className="rule" />
        <div style={{ display: "flex", justifyContent: "center", gap: 26, padding: "8px 0", flexWrap: "wrap" }} className="mono">
          <span>AI SYSTEMS</span><span style={{ color: FAINT }}>·</span>
          <span>FULL STACK</span><span style={{ color: FAINT }}>·</span>
          <span>REAL-WORLD IMPACT</span>
        </div>
        <div className="rule-thick" />
      </header>

      <NavBar items={TOC_ITEMS} active={activeSection} />

      {/* COVER FEATURE */}
      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 30 }}>
        <div role="button" tabIndex={0} onClick={() => route.open("saltellite")} onKeyDown={(e) => e.key === "Enter" && route.open("saltellite")} style={{ cursor: "pointer", color: INK }}>
          <div className="cover-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 50, alignItems: "center" }}>
            <Fig no="0.1" caption="SALTellite — Sentinel-2 salinity monitoring, Selangor coast">
              <SatelliteView hero />
            </Fig>
            <div>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }} className="mono">
                <span style={{ color: RED }}>FEATURE NO. 01</span>
                <span style={{ color: GREY }}>AI × REMOTE SENSING</span>
              </div>
              <h2 className="headline" style={{ fontSize: "clamp(36px,5.5vw,76px)", marginTop: 12, minHeight: "3.2em" }}>
                <Typewriter lines={["Watching", "the salt arrive", "from orbit."]} speed={38} />
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: GREY, marginTop: 16, maxWidth: 560 }}>
                {PROJECTS[0].dek}
              </p>
              <div className="mono" style={{ color: RED, marginTop: 18 }}>READ THE COVER STORY ↓</div>
              <div style={{ marginTop: 26 }}><span className="stamp">EST. PASUM → UM</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <Newswire />

      {/* EDITOR'S LETTER — unnumbered front matter */}
      <section className="wrap" id="editors-letter" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <Reveal>
          <div className="letter-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 40 }}>
            <div className="mono" style={{ color: GREY, letterSpacing: 2, lineHeight: 2 }}>
              FROM THE EDITOR<br />VOL. 01 · KUALA LUMPUR
            </div>
            <div>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,2.4vw,27px)", lineHeight: 1.5, fontWeight: 600, margin: 0 }}>
                I started this issue with a simple observation: the most interesting software
                problems don't live in software.
              </p>
              <p className="body-p" style={{ marginTop: 20, fontSize: 16, lineHeight: 1.8 }}>
                They live in paddy fields where salt creeps in unseen, in ten-person teams trying
                to agree on what "done" means, in the gap between a working demo and a system
                someone actually relies on. Everything in this issue — a satellite watching
                Malaysian farmland, a nutrition backend that had to survive ten contributors,
                a requirements package that took a semester to specify — comes from that gap.
              </p>
              <p className="body-p" style={{ marginTop: 14, fontSize: 16, lineHeight: 1.8 }}>
                My rule while building all of it: working software over theoretical completeness.
                Ship the thing, learn from the contact with reality, write down what broke.
                This issue is the writing-down part.
              </p>
              <div style={{ marginTop: 30 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 26 }}>Ajwad Tahrir</div>
                <div className="mono" style={{ color: GREY, marginTop: 6 }}>EDITOR & SOLE CONTRIBUTOR · JULY 2026</div>
              </div>
            </div>
            <div aria-hidden="true" style={{ borderLeft: `1px solid ${FAINT}`, paddingLeft: 24 }} className="mono">
              <div style={{ color: GREY, lineHeight: 2.2 }}>
                IN THIS ISSUE:<br />
                1 SATELLITE<br />
                50 REQUIREMENTS<br />
                105 SURVEY RESPONSES<br />
                10 DEVELOPERS<br />
                0 TEMPLATES
              </div>
            </div>
          </div>
        </Reveal>
      </section>
      <div className="wrap"><div className="rule" /></div>

      {/* THE PROFILE */}
      <section className="wrap" id="author" style={{ paddingTop: 44, paddingBottom: 10 }}>
        <Reveal>
          <div className="kicker">00 · THE PROFILE</div>
          <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: 40, marginTop: 16, alignItems: "start" }}>
            <figure style={{ margin: 0 }}>
              <div style={{ border: `1px solid ${INK}`, aspectRatio: "3 / 4", overflow: "hidden", background: "#E7E3DA" }}>
                <img
                  src="/portrait.jpg"
                  alt="Portrait of Ajwad Tahrir"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                />
                <div style={{ display: "none", height: "100%", alignItems: "center", justifyContent: "center", padding: 14, textAlign: "center" }} className="mono">
                  DROP /public/portrait.jpg
                </div>
              </div>
              <figcaption className="mono" style={{ color: GREY, paddingTop: 8 }}>AJWAD TAHRIR, KUALA LUMPUR</figcaption>
            </figure>
            <div>
              <h2 className="headline" style={{ fontSize: "clamp(32px,5vw,60px)" }}>Ajwad Tahrir</h2>
              <p className="body-p" style={{ marginTop: 14, fontSize: 17, lineHeight: 1.75 }}>
                Ajwad Tahrir builds software where artificial intelligence meets physical problems.
                From satellite imagery monitoring farmland to full-stack systems built for teams,
                his work explores how technology can create measurable impact.
              </p>
              <p className="body-p" style={{ marginTop: 12, fontSize: 15.5, color: GREY }}>
                Engineering philosophy: working software over theoretical completeness —
                specify carefully, build quickly, ship what matters.
              </p>
            </div>
            <div>
              <div style={{ marginTop: 6 }}>
                <div className="mono" style={{ padding: "10px 0", borderBottom: `1px solid ${INK}`, borderTop: `3px solid ${INK}` }}><b>LOCATION</b> — Petaling Jaya, Malaysia</div>
                <div className="mono" style={{ padding: "10px 0", borderBottom: `1px solid ${INK}` }}><b>EDUCATION</b> — Software Engineering, Universiti Malaya</div>
                <div className="mono" style={{ padding: "10px 0", borderBottom: `1px solid ${INK}` }}><b>CURRENT FOCUS</b> — AI × Cloud × Product Engineering</div>
                <div className="mono" style={{ padding: "10px 0", borderBottom: `1px solid ${INK}` }}><b>OPEN TO</b> — Internships · Hackathons · Engineering projects</div>
              </div>
            </div>
          </div>
        </Reveal>
        <PageFoot no="00" />
      </section>

      {/* FEATURES */}
      <main className="wrap" id="features" style={{ paddingTop: 26 }}>
        <div className="rule-thick" style={{ marginBottom: 4 }} />
        <Reveal>
          <FeatureGrid projects={PROJECTS} onOpen={route.open} />
        </Reveal>
      </main>

      {/* FULL-PAGE QUOTE SPREAD */}
      <QuoteSpread credit="— ON BUILDING SALTELLITE">
        “The best alert is the one a farmer gets before the damage — not after.”
      </QuoteSpread>

      <SectionBreak no="02" label="ENGINEERING NOTES" />

      {/* ENGINEERING NOTES */}
      <section className="wrap" id="notes" style={{ paddingTop: 50, paddingBottom: 10 }}>
        <Reveal>
          <div className="kicker">02 · ENGINEERING NOTES</div>
          <h2 className="headline" style={{ fontSize: "clamp(36px,6vw,72px)" }}>By the numbers</h2>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${STATS.length}, 1fr)`, border: `1px solid ${INK}`, marginTop: 24 }}>
            {STATS.map(([n, label]) => (
              <div key={label} className="stat">
                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,44px)", color: INK }}>{n}</div>
                <div className="mono" style={{ color: GREY, marginTop: 8, lineHeight: 1.5 }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <PageFoot no="02" />
      </section>

      <SectionBreak no="03" label="ENGINEERING LOG · THE CHRONICLES" />

      {/* ENGINEERING LOG */}
      <section className="wrap" id="log" style={{ paddingTop: 70, paddingBottom: 40 }}>
        <Reveal>
          <div className="kicker">03 · ENGINEERING LOG</div>
          <h2 className="headline" style={{ fontSize: "clamp(36px,6vw,72px)" }}>The Chronicles</h2>
          <div style={{ marginTop: 40 }}>
            {ERAS.map(([yr, era, items], idx) => (
              <div key={yr} style={{ position: "relative", padding: "70px 0 80px", overflow: "hidden" }}>
                <div aria-hidden="true" className="era-ghost" style={{ position: "absolute", top: "50%", right: idx % 2 ? "auto" : 0, left: idx % 2 ? 0 : "auto", transform: "translateY(-50%)", fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(120px,22vw,320px)", color: INK, opacity: 0.05, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {yr}
                </div>
                <div className="era-grid" style={{ display: "grid", gridTemplateColumns: "120px 28px 1fr", gap: 0, position: "relative" }}>
                  <div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1 }}>{yr}</div>
                    <div className="mono" style={{ color: RED, letterSpacing: 2, marginTop: 8 }}>{era}</div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 6, bottom: idx === ERAS.length - 1 ? "auto" : -80, height: idx === ERAS.length - 1 ? 14 : "auto", width: 1, background: INK }} />
                    <div style={{ position: "absolute", left: "50%", top: 6, width: 9, height: 9, background: RED, transform: "translateX(-50%)", borderRadius: "50%" }} />
                  </div>
                  <div style={{ paddingLeft: 20 }}>
                    {items.map(([name, tag]) => (
                      <div key={name} style={{ padding: "12px 0", display: "flex", justifyContent: "space-between", gap: 16, borderBottom: `1px dotted ${FAINT}`, maxWidth: 860 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{name}</span>
                        <span className="mono" style={{ color: GREY, textAlign: "right" }}>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <PageFoot no="03" />
      </section>

      <SectionBreak no="04" label="THE ENGINEERING BLUEPRINT" />

      {/* ENGINEERING BLUEPRINT */}
      <section className="wrap" id="blueprint" style={{ paddingTop: 50, paddingBottom: 40 }}>
        <Reveal>
          <div className="kicker">04 · THE ENGINEERING BLUEPRINT</div>
          <h2 className="headline" style={{ fontSize: "clamp(36px,6vw,72px)" }}>How the stack layers</h2>
          <div className="spread-grid" style={{ marginTop: 44, alignItems: "center", gap: 60 }}>
            <div>
              <p className="body-p" style={{ fontSize: 17, lineHeight: 1.8, maxWidth: 520 }}>
                Every system in this issue is a slice through the same four layers.
                A React dashboard or a Flutter app at the surface; FastAPI or Express
                routing beneath it; MongoDB or Firebase holding state; and at the bottom,
                the intelligence — ML models and satellite data doing the actual thinking.
              </p>
              <p className="body-p" style={{ fontSize: 15.5, lineHeight: 1.75, color: GREY, marginTop: 18, maxWidth: 520 }}>
                The stack narrows as it deepens: many interfaces, fewer APIs, one source
                of truth, and a single intelligence layer that makes the product worth building.
              </p>
              <div style={{ marginTop: 26 }}>
                {[
                  ["SALTellite", "React → FastAPI → — → GB model + LLM"],
                  ["FitTrack", "JS → Express → MongoDB → —"],
                ].map(([name, slice]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "8px 0", borderBottom: `1px dotted ${FAINT}`, maxWidth: 520 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{name}</span>
                    <span className="mono" style={{ color: GREY }}>{slice}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {[
                ["PRODUCT LAYER", "React · Flutter", "0px"],
                ["API LAYER", "FastAPI · Express · Node.js", "6%"],
                ["DATA LAYER", "MongoDB · Firebase", "12%"],
                ["INTELLIGENCE LAYER", "scikit-learn · Sentinel-2 · LLM APIs", "18%"],
              ].map(([layer, tech, inset], i) => (
                <div key={layer} style={{ marginLeft: inset, marginRight: inset, marginTop: i === 0 ? 0 : -1, border: `1px solid ${INK}`, background: i % 2 ? "#FDFCFA" : PAPER, padding: "22px 26px", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <span className="mono" style={{ letterSpacing: 2, color: i === 3 ? RED : GREY }}>{layer}</span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: "clamp(16px,1.6vw,22px)" }}>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <PageFoot no="04" />
      </section>

      <SectionBreak no="05" label="FIELD REPORTS" />

      {/* FIELD REPORTS */}
      <section className="wrap" id="reports" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <Reveal>
          <div className="kicker">05 · FIELD REPORTS</div>
          <h2 className="headline" style={{ fontSize: "clamp(36px,6vw,72px)" }}>Verified outcomes</h2>
          <div className="reports-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 24 }}>
            {REPORTS.map(([title, items]) => (
              <div key={title} className="report">
                <div className="mono" style={{ letterSpacing: 1.5, borderBottom: `2px solid ${INK}`, paddingBottom: 8, marginBottom: 12 }}>{title}</div>
                {items.map((it) => (
                  <div key={it} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 14.5 }}>
                    <span style={{ color: RED, fontWeight: 700 }}>✓</span><span>{it}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
        <PageFoot no="05" />
      </section>

      <SectionBreak no="06" label="REFERENCE · THE STACK INDEX" />

      {/* STACK INDEX */}
      <section className="wrap" id="index" style={{ paddingTop: 40, paddingBottom: 50 }}>
        <Reveal>
          <div className="kicker">06 · REFERENCE</div>
          <h2 className="headline" style={{ fontSize: "clamp(36px,6vw,72px)" }}>The Stack Index</h2>
          <p className="mono" style={{ color: GREY, marginTop: 10 }}>HOVER AN ENTRY TO OPEN ITS DOSSIER</p>
          <SkillIndex sel={skill} setSel={setSkill} />
        </Reveal>
        <PageFoot no="06" />
      </section>

      {/* CLOSING PAGE */}
      <section id="letters" style={{ background: INK, color: PAPER }}>
        <Reveal>
          <div className="wrap" style={{ paddingTop: 70, paddingBottom: 40, textAlign: "center" }}>
            <div className="kicker">07 · LETTERS TO THE EDITOR</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(38px,7vw,80px)", margin: "14px 0 6px", color: PAPER, letterSpacing: -1 }}>
              AJWAD TAHRIR
            </h2>
            <div className="mono" style={{ color: "#9B968D", letterSpacing: 2 }}>
              SOFTWARE ENGINEER · AI × CLOUD × PRODUCT ENGINEERING
            </div>
            <div style={{ borderTop: "1px solid #3A3A42", maxWidth: 480, margin: "28px auto" }} />
            <div className="mono" style={{ color: "#9B968D", marginBottom: 20 }}>
              AVAILABLE FOR — INTERNSHIPS · HACKATHONS · ENGINEERING PROJECTS
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:hello@example.com" className="cta">EMAIL ✉</a>
              <a href="https://github.com/AjwadTahrir" className="cta-ghost">GITHUB ↗</a>
              <a href="#" className="cta-ghost">LINKEDIN ↗</a>
            </div>

            {/* THE END */}
            <div style={{ marginTop: 90, paddingTop: 60, borderTop: "1px solid #3A3A42" }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", color: PAPER, letterSpacing: -1, lineHeight: 1 }}>
                THE END
              </div>
              <div className="mono" style={{ color: "#9B968D", marginTop: 20, letterSpacing: 3, lineHeight: 2.2 }}>
                ISSUE 01 · PRINTED JULY {now.getFullYear()}<br />
                SEE YOU IN ISSUE 02.
              </div>
            </div>
          </div>
          <div className="wrap mono" style={{ paddingTop: 20, paddingBottom: 24, color: "#7D7870", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, borderTop: "1px solid #3A3A42" }}>
            <span>© {now.getFullYear()} AJWAD TAHRIR — VOL. 01, THE SOFTWARE ENGINEER ISSUE</span>
            <span>PRINTED NOWHERE. RENDERED EVERYWHERE.</span>
          </div>
        </Reveal>
      </section>

      <FeatureOverlay project={activeProject} onClose={route.close} />
    </div>
  );
}
