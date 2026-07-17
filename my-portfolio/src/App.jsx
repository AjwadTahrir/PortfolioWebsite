import React, { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   AJWAD — THE SOFTWARE ENGINEER ISSUE (v5)
   "The first issue of an engineer's career magazine."
   v5: real rendered visuals (SVG satellite view, SMS mock, dashboards,
   diagrams) replacing all placeholders; Engineering Log, Systems Built
   blueprints, Field Reports, magazine closing page.
------------------------------------------------------------------- */

const INK = "#141414";
const PAPER = "#F7F5F0";
const RED = "#C8371E";
const GREY = "#6E6A63";
const FAINT = "#B9B4AA";

/* ================= VISUALS (all generated, no images) ============ */

function SatelliteView({ hero }) {
  const cells = [];
  const cols = 14, rows = hero ? 8 : 6;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 31 + c * 17) % 97;
      const coastal = c > cols - 4 - (r % 3);
      const risk = coastal ? seed % 3 : seed % 7 === 0 ? 1 : 0;
      cells.push({ r, c, risk, seed });
    }
  }
  const greens = ["#7C8F5E", "#8C9E6B", "#6E8253", "#93A375", "#849868"];
  const riskFill = ["transparent", "rgba(224,192,103,0.55)", "rgba(200,55,30,0.5)"];
  const W = 560, H = hero ? 330 : 240, cw = W / cols, ch = H / rows;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", background: "#5B6E8C" }} role="img" aria-label="Satellite view of coastal farmland with salinity risk overlay">
      <rect x={W - 90} y="0" width="90" height={H} fill="#4F678C" />
      {cells.map(({ r, c, risk, seed }) => (
        <g key={`${r}-${c}`}>
          <rect x={c * cw} y={r * ch} width={cw - 1.5} height={ch - 1.5} fill={greens[seed % 5]} />
          {risk > 0 && <rect x={c * cw} y={r * ch} width={cw - 1.5} height={ch - 1.5} fill={riskFill[risk]} />}
        </g>
      ))}
      <rect x="12" y="12" width="158" height="20" fill="rgba(20,20,20,0.78)" />
      <text x="20" y="26" fill="#fff" fontFamily="monospace" fontSize="10">SENTINEL-2 · L2A · B11/B8A</text>
      <rect x="12" y={H - 34} width="196" height="22" fill="rgba(20,20,20,0.78)" />
      <text x="20" y={H - 19} fill="#fff" fontFamily="monospace" fontSize="10">SELANGOR COAST · ALT 786 KM</text>
      <g fontFamily="monospace" fontSize="9" fill="#fff">
        <rect x={W - 162} y="12" width="150" height="46" fill="rgba(20,20,20,0.78)" />
        <rect x={W - 152} y="20" width="10" height="8" fill="rgba(224,192,103,0.9)" />
        <text x={W - 136} y="27">SALINITY WATCH</text>
        <rect x={W - 152} y="36" width="10" height="8" fill="rgba(200,55,30,0.9)" />
        <text x={W - 136} y="43">HIGH RISK ZONE</text>
      </g>
      <g stroke="#fff" strokeWidth="1.5" fill="none">
        <rect x={cw * 10} y={ch * 2} width={cw * 2} height={ch * 2} strokeDasharray="4 3" />
      </g>
      <text x={cw * 10} y={ch * 2 - 5} fill="#fff" fontFamily="monospace" fontSize="9">ZONE 04</text>
    </svg>
  );
}

function SmsMock() {
  return (
    <div style={{ background: "#E9E5DD", padding: "22px 18px", height: "100%", minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 230, background: "#fff", border: `1px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
        <div style={{ background: INK, color: "#fff", padding: "8px 12px", fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 1 }}>
          SMS · SALTELLITE
        </div>
        <div style={{ padding: 14, fontSize: 12.5, lineHeight: 1.6 }}>
          <b style={{ color: RED }}>SALT RISK ALERT — ZONE 04</b>
          <br />High salinity risk detected in your area.
          <br /><br />Recommended action: increase freshwater irrigation before Thursday.
          <br /><br /><span style={{ color: GREY, fontSize: 11 }}>Sent 06:00 MYT · no app required</span>
        </div>
      </div>
    </div>
  );
}

function PipelineDiagram({ title, steps }) {
  return (
    <div style={{ border: `1px solid ${INK}`, borderBottom: "none", padding: "18px 16px", background: "#FDFCFA", height: "100%", minHeight: 240 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 12 }}>{title}</div>
      {steps.map((s, i) => (
        <div key={s} style={{ textAlign: "center" }}>
          <div style={{ border: `1px solid ${INK}`, padding: "6px 10px", fontFamily: "'Space Mono',monospace", fontSize: 10.5, background: i === steps.length - 1 ? INK : "#fff", color: i === steps.length - 1 ? "#fff" : INK }}>
            {s}
          </div>
          {i < steps.length - 1 && <div style={{ color: GREY, fontSize: 11, lineHeight: "14px" }}>↓</div>}
        </div>
      ))}
    </div>
  );
}

function FitTrackMock() {
  const rows = [["Breakfast", "512 kcal"], ["Lunch", "746 kcal"], ["Dinner", "618 kcal"], ["Water", "1.9 / 2.5 L"]];
  return (
    <div style={{ background: "#FDFCFA", height: "100%", minHeight: 240 }}>
      <div style={{ background: INK, color: "#fff", padding: "8px 12px", fontFamily: "'Space Mono',monospace", fontSize: 10, display: "flex", justifyContent: "space-between" }}>
        <span>FITTRACK · NUTRITION PLANNER</span><span>JWT ✓</span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 26 }}>1,876</span>
          <span className="mono" style={{ color: GREY }}>/ 2,200 KCAL</span>
        </div>
        <div style={{ height: 8, background: "#E7E3DA", margin: "8px 0 14px" }}>
          <div style={{ height: "100%", width: "85%", background: INK }} />
        </div>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px dotted ${FAINT}`, fontSize: 13 }}>
            <span>{k}</span><span className="mono">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseMock() {
  return (
    <div style={{ background: "#FDFCFA", height: "100%", minHeight: 240, padding: 14 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 8 }}>USE CASE MODEL · EXCERPT</div>
      <svg viewBox="0 0 260 150" style={{ width: "100%" }}>
        {[["Owner", 20, 44], ["Vet", 20, 112]].map(([n, x, y]) => (
          <g key={n} fontFamily="monospace" fontSize="8">
            <circle cx={x + 8} cy={y - 14} r="6" fill="none" stroke={INK} />
            <line x1={x + 8} y1={y - 8} x2={x + 8} y2={y + 6} stroke={INK} />
            <line x1={x} y1={y - 2} x2={x + 16} y2={y - 2} stroke={INK} />
            <line x1={x + 8} y1={y + 6} x2={x + 2} y2={y + 16} stroke={INK} />
            <line x1={x + 8} y1={y + 6} x2={x + 14} y2={y + 16} stroke={INK} />
            <text x={x + 8} y={y + 28} textAnchor="middle" fill={INK}>{n}</text>
          </g>
        ))}
        <rect x="90" y="10" width="162" height="132" fill="none" stroke={INK} />
        <text x="171" y="24" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={GREY}>PET HEALTH SYSTEM</text>
        {[["Book appointment", 58], ["View health record", 92], ["Update treatment", 124]].map(([n, y]) => (
          <g key={n}>
            <ellipse cx="171" cy={y} rx="62" ry="13" fill="#fff" stroke={INK} />
            <text x="171" y={y + 3} textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={INK}>{n}</text>
          </g>
        ))}
        <line x1="36" y1="40" x2="109" y2="56" stroke={GREY} />
        <line x1="36" y1="46" x2="109" y2="88" stroke={GREY} />
        <line x1="36" y1="110" x2="109" y2="122" stroke={GREY} />
        <line x1="36" y1="106" x2="109" y2="94" stroke={GREY} />
      </svg>
    </div>
  );
}

function MoscowMock() {
  const cols = [["MUST", 5, INK], ["SHOULD", 4, "#4A4A55"], ["COULD", 3, GREY], ["WON'T", 2, FAINT]];
  return (
    <div style={{ background: "#FDFCFA", height: "100%", minHeight: 240, padding: 14 }}>
      <div className="mono" style={{ color: GREY, letterSpacing: 2, marginBottom: 10 }}>MOSCOW BACKLOG · 23 ITEMS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {cols.map(([label, n, color]) => (
          <div key={label}>
            <div className="mono" style={{ fontSize: 9, borderBottom: `2px solid ${color}`, paddingBottom: 4, marginBottom: 6 }}>{label}</div>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} style={{ height: 14, background: "#fff", border: `1px solid ${FAINT}`, marginBottom: 4 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

function Fig({ children, caption, no }) {
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ border: `1px solid ${INK}`, flex: 1 }}>{children}</div>
      <figcaption className="mono" style={{ color: GREY, padding: "8px 0", borderBottom: `1px solid ${INK}` }}>
        <span style={{ color: INK, fontWeight: 700 }}>FIG. {no}</span> — {caption}
      </figcaption>
    </figure>
  );
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

/* Interactive cross-reference skill index: hover/tap an entry, see its dossier */
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

/* ================= DATA ========================================== */

const PROJECTS = [
  {
    id: "saltellite",
    no: "01",
    tier: "main",
    kicker: "MAIN FEATURE · AI × REMOTE SENSING",
    name: "SALTellite",
    dek: "An early-warning system that watches Malaysia's coastal farmland from orbit — and texts farmers before the salt arrives.",
    problem: "Saline intrusion creeps into coastal paddy fields silently. By the time farmers see the damage, the harvest is already lost.",
    tech: "Sentinel-2 imagery flows through the Sentinel Hub Statistical API into a Gradient Boosting model that flags salinity risk per zone. Llama 3.3 (via Groq) turns the prediction into plain-language advice, and Infobip delivers it as SMS — no app install required.",
    impact: "Built for the Shortcut Asia Challenge 2026; cleared both the screening and in-person presentation rounds.",
    pull: "“The best alert is the one a farmer gets before the damage — not after.”",
    stack: ["React", "FastAPI", "Sentinel-2", "scikit-learn", "Groq", "Infobip"],
    link: "https://github.com/AjwadTahrir/saltellite",
    decisions: [
      ["Gradient Boosting over deep learning", "Small labeled dataset and tabular spectral features — a GB model trains in seconds, explains its feature importances, and doesn't need a GPU the project couldn't afford."],
      ["SMS over an app", "The users are farmers, not app installers. Infobip SMS meant zero onboarding — but it constrains alerts to plain text, which pushed the LLM-explanation design."],
      ["What I'd do differently", "Invest earlier in explaining the stack's internals — the judges' feedback was that the demo outran my ability to defend every component under questioning."],
    ],
    year: "2026",
    visuals: [
      { no: "1.1", caption: "Sentinel-2 salinity risk overlay, Selangor coast", el: <SatelliteView /> },
      { no: "1.2", caption: "Prediction pipeline, satellite to SMS", el: <PipelineDiagram title="ML PIPELINE" steps={["Sentinel-2 Satellite", "Image Processing", "Feature Extraction", "Gradient Boosting", "Risk Prediction", "Llama 3.3 Explanation", "SMS Farmer Alert"]} /> },
      { no: "1.3", caption: "Farmer-facing SMS alert, Zone 04", el: <SmsMock /> },
    ],
  },
  {
    id: "fittrack",
    no: "02",
    tier: "feature",
    kicker: "FEATURE STORY · FULL-STACK WEB",
    name: "FitTrack",
    dek: "The Nutrition Planner module of a team fitness app — owned end to end, backend to browser.",
    problem: "A ten-person team app lives or dies on its plumbing: auth, validation, and data scoping that don't leak between users.",
    tech: "Express 5 + MongoDB backend with JWT auth, Zod validation, and multi-user scoping. Water tracking, dashboard wiring, and the team's whole Git workflow coordinated so ten people could ship without collisions.",
    impact: "Delivered across two course phases (WIF2003), from Bootstrap frontend to full ES-module backend.",
    pull: "“Auth, validation, scoping — the unglamorous parts done properly.”",
    stack: ["Node.js", "Express 5", "MongoDB", "JWT", "Zod"],
    link: null,
    year: "2025–26",
    decisions: [
      ["Zod at the API boundary", "Validating every request body at the edge meant bad data never reached Mongoose — cheaper than debugging corrupted documents later."],
      ["JWT over sessions", "Stateless auth kept the backend simple for a team without shared session infrastructure — the trade-off is no server-side revocation."],
      ["What I'd do differently", "Set up the multi-user data scoping pattern on day one instead of retrofitting it — retrofit touched nearly every query."],
    ],
    visuals: [
      { no: "2.1", caption: "Nutrition Planner interface, daily view", el: <FitTrackMock /> },
      { no: "2.2", caption: "Request path, client to database", el: <PipelineDiagram title="ARCHITECTURE" steps={["React Frontend", "Express API", "Zod Validation", "JWT Middleware", "MongoDB"]} /> },
    ],
  },
  {
    id: "pethealth",
    no: "03",
    tier: "note",
    kicker: "ENGINEERING NOTES · REQUIREMENTS",
    name: "Pet Health Records",
    dek: "Leading ten people through fifty functional requirements — and a privacy study on the side.",
    problem: "Before a vet appointment system can be built right, it has to be specified right — by ten people who agree.",
    tech: "Full requirements package: 50 FRs, 25 NFRs, 16 use cases, MoSCoW-prioritised backlog. Companion Privacy-by-Design paper surveyed 105 respondents with full statistical analysis (Cronbach's α = .955).",
    impact: "Team lead for Group 10 — deliverables, rubric compliance, and documentation across the semester.",
    pull: "“Before you build it right, you have to specify it right.”",
    stack: ["Requirements", "Use cases", "MoSCoW", "Statistics"],
    link: null,
    year: "2026",
    decisions: [
      ["MoSCoW over numeric priority scores", "With ten people voting, a four-bucket system forced real conversations about scope — numeric scores just hide disagreement in decimals."],
      ["Surveying 105 respondents", "The Privacy-by-Design paper needed statistical weight over anecdote — Cronbach's α = .955 made the construct defensible."],
      ["What I'd do differently", "Freeze the requirements baseline earlier — late-arriving 'must-haves' cost the team rework in the final weeks."],
    ],
    visuals: [
      { no: "3.1", caption: "Use case model, appointment flows", el: <UseCaseMock /> },
      { no: "3.2", caption: "MoSCoW prioritisation board", el: <MoscowMock /> },
    ],
  },
];

const STATS = [
  ["50+", "Functional requirements written"],
  ["105", "Survey responses analysed"],
  ["10", "Developers coordinated"],
  ["786 km", "Satellite orbit height"],
  ["3+", "AI systems built"],
];

const ERAS = [
  ["2026", "AI SYSTEMS ERA", [
    ["SALTellite", "AI × Satellite · Sentinel-2 + ML"],
    ["Requirements leadership", "10-person team"],
  ]],
  ["2025", "FULL-STACK ERA", [
    ["First team products shipped", "Node · MongoDB"],
    ["First ML systems", "scikit-learn"],
    ["Flutter applications", "Mobile"],
  ]],
  ["2024", "FOUNDATION ERA", [
    ["Software Engineering, Universiti Malaya", "Enrolled"],
    ["First applications built", "Java · Python"],
  ]],
  ["2023", "ON-RAMP", [
    ["Foundation studies", "PASUM"],
  ]],
];

const REPORTS = [
  ["SHORTCUT ASIA CHALLENGE 2026", ["Screening round passed", "In-person presentation round completed"]],
  ["SOFTWARE ENGINEERING PROJECT", ["Managed 10-person team", "Delivered full requirements package"]],
  ["RESEARCH PROJECT", ["105 survey respondents", "Cronbach α = .955, full statistical analysis"]],
];

const NEWSWIRE = [
  ["SALTELLITE CLEARS SHORTCUT ASIA PRESENTATION ROUND", "saltellite"],
  ["GRADIENT BOOSTING MODEL FLAGS SALINITY FROM ORBIT", "saltellite"],
  ["10-PERSON TEAM SHIPS FULL REQUIREMENTS PACKAGE", "pethealth"],
  ["NUTRITION PLANNER MODULE DELIVERED END TO END", "fittrack"],
  ["105 RESPONDENTS SURVEYED FOR PRIVACY-BY-DESIGN STUDY", "pethealth"],
  ["SMS ALERTS REACH FARMERS — NO APP REQUIRED", "saltellite"],
  ["JWT AUTH + ZOD VALIDATION HOLD THE LINE", "fittrack"],
];

const TOC_ITEMS = [
  ["author", "Profile", "00"],
  ["features", "Features", "01"],
  ["notes", "Notes", "02"],
  ["log", "Chronicles", "03"],
  ["blueprint", "Blueprint", "04"],
  ["reports", "Reports", "05"],
  ["index", "Stack", "06"],
  ["letters", "Letters", "07"],
];
const TOC_IDS = TOC_ITEMS.map((t) => t[0]);

const SKILLS = [
  { name: "React", cat: "FRONTEND", since: "2025", projects: ["SALTellite"], note: "Default choice for dashboards and data-heavy interfaces." },
  { name: "Flutter", cat: "FRONTEND", since: "2025", projects: [], note: "Cross-platform mobile applications in Dart." },
  { name: "FastAPI", cat: "BACKEND", since: "2026", projects: ["SALTellite"], note: "Python APIs serving ML predictions — typed, async, fast to ship." },
  { name: "Express", cat: "BACKEND", since: "2025", projects: ["FitTrack"], note: "Express 5 with Zod validation and JWT middleware." },
  { name: "Node.js", cat: "BACKEND", since: "2025", projects: ["FitTrack"], note: "ES-module backends coordinated across a 10-person team." },
  { name: "MongoDB", cat: "DATA", since: "2025", projects: ["FitTrack"], note: "Mongoose schemas with multi-user data scoping." },
  { name: "Firebase", cat: "DATA", since: "2025", projects: [], note: "Auth and realtime data for mobile builds." },
  { name: "scikit-learn", cat: "INTELLIGENCE", since: "2025", projects: ["SALTellite"], note: "Gradient Boosting for salinity risk classification." },
  { name: "Sentinel-2", cat: "INTELLIGENCE", since: "2026", projects: ["SALTellite"], note: "Satellite imagery via the Sentinel Hub Statistical API." },
  { name: "Python", cat: "LANGUAGES", since: "2024", projects: ["SALTellite"], note: "ML pipelines and API backends." },
  { name: "JavaScript", cat: "LANGUAGES", since: "2024", projects: ["FitTrack"], note: "Both sides of the stack." },
  { name: "Java", cat: "LANGUAGES", since: "2024", projects: [], note: "Object-oriented foundations from coursework." },
  { name: "Requirements Eng.", cat: "PROCESS", since: "2026", projects: ["Pet Health Records"], note: "50 FRs, 25 NFRs, 16 use cases, MoSCoW prioritisation." },
];

/* ================= FEATURE ARTICLE =============================== */

function Feature({ p }) {
  const [open, setOpen] = useState(false);
  const topRef = useRef(null);
  const main = p.tier === "main";
  const note = p.tier === "note";
  useEffect(() => {
    const onOpen = (e) => { if (e.detail === p.id) setOpen(true); };
    window.addEventListener("open-article", onOpen);
    return () => window.removeEventListener("open-article", onOpen);
  }, [p.id]);
  const toggle = () => {
    setOpen(!open);
    if (!open) setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  return (
    <div id={p.id} ref={topRef} style={{ scrollMarginTop: 60 }}>
      <div
        className="article-row"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
        style={{ padding: main ? "44px 0" : note ? "24px 0" : "34px 0" }}
      >
        <div className="no" style={{ fontSize: main ? 56 : note ? 30 : 44 }}>{p.no}</div>
        <div>
          <div className="kicker">{p.kicker}</div>
          <h2 className="headline" style={{ fontSize: main ? "clamp(32px,5.5vw,60px)" : note ? "clamp(20px,3vw,30px)" : "clamp(26px,4vw,44px)" }}>
            {p.name}
          </h2>
          <p style={{ color: GREY, fontSize: main ? 17 : 15.5, lineHeight: 1.55, margin: "10px 0 0", maxWidth: main ? 640 : 560 }}>
            {p.dek}
          </p>
        </div>
        <div className="article-side" style={{ textAlign: "right" }}>
          <div className="mono" style={{ color: GREY }}>{p.year}</div>
          <div className="mono" style={{ marginTop: 8, lineHeight: 1.8, color: GREY }}>
            {p.stack.slice(0, 3).map((s) => <div key={s}>{s}</div>)}
          </div>
          <div className="mono" style={{ color: open ? GREY : RED, marginTop: 10 }}>{open ? "CLOSE ✕" : "READ →"}</div>
        </div>
      </div>

      <div className="spread" style={{ maxHeight: open ? 3400 : 0, opacity: open ? 1 : 0 }}>
        <div style={{ borderTop: `3px solid ${INK}`, padding: "30px 0 40px" }}>
          <div className="frames-row">
            {p.visuals.map((v) => (
              <Fig key={v.no} no={v.no} caption={v.caption}>{v.el}</Fig>
            ))}
          </div>
          <div className="spread-grid" style={{ marginTop: 28 }}>
            <div>
              <h3 className="section-h">THE PROBLEM</h3>
              <p className="body-p">{p.problem}</p>
            </div>
            <div>
              <h3 className="section-h">THE TECHNOLOGY</h3>
              <p className="body-p">{p.tech}</p>
            </div>
          </div>
          <blockquote className="pull">{p.pull}</blockquote>
          {p.decisions && (
            <div style={{ marginTop: 6 }}>
              <h3 className="section-h" style={{ color: RED }}>DECISIONS & TRADE-OFFS</h3>
              <div className="decisions-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${p.decisions.length}, 1fr)`, gap: 24, marginTop: 12 }}>
                {p.decisions.map(([title, body]) => (
                  <div key={title} style={{ borderTop: `2px solid ${INK}`, paddingTop: 12 }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{title}</div>
                    <p className="body-p" style={{ fontSize: 14.5, lineHeight: 1.65, color: "#3E3D48" }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="spread-grid" style={{ marginTop: 28 }}>
            <div>
              <h3 className="section-h">THE RESULT</h3>
              <p className="body-p">{p.impact}</p>
            </div>
            <div>
              <h3 className="section-h">FILED UNDER</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {p.stack.map((s) => (
                  <span key={s} className="mono" style={{ border: `1px solid ${FAINT}`, color: GREY, padding: "4px 10px" }}>{s}</span>
                ))}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="cta" style={{ marginTop: 18 }}>
                  READ THE CODE ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
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
        <a href="#saltellite" style={{ textDecoration: "none", color: INK }}>
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
        </a>
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
        <div className="rule-thick" />
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} delay={0.04 * i}>
            <Feature p={p} />
          </Reveal>
        ))}
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
    </div>
  );
}