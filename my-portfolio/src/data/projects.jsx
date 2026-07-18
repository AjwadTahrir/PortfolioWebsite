import React from "react";
import SatelliteView from "../components/visuals/SatelliteView";
import SmsMock from "../components/visuals/SmsMock";
import PipelineDiagram from "../components/visuals/PipelineDiagram";
import FitTrackMock from "../components/visuals/FitTrackMock";
import UseCaseMock from "../components/visuals/UseCaseMock";
import MoscowMock from "../components/visuals/MoscowMock";

export const PROJECTS = [
  {
    id: "saltellite",
    no: "01",
    tier: "main",
    importance: "cover",
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
    importance: "feature",
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
    importance: "note",
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
  {
    id: "bizbuddy",
    no: "04",
    importance: "feature",
    kicker: "FEATURE STORY · AI × FINANCIAL INCLUSION",
    name: "BizBuddy",
    dek: "A WhatsApp-native AI assistant that gives Southeast Asian micro-businesses sales tracking, credit scoring, and advice — inside the app they already use.",
    problem: "MSMEs across ASEAN run their businesses over WhatsApp but stay invisible to formal credit systems — no records, no score, no loans.", // TODO: your words
    tech: "Python/Flask backend with Firebase Firestore, Gemini API for the assistant, and a webhook architecture connecting the WhatsApp Business API. Frontend (landing, dashboard, bank portal) built as a vanilla JS PWA, deployed on Railway.",
    impact: "Top 20 Finalist at BorneoHack 2026 for addressing financial inclusion challenges across ASEAN. Built with team dawnwannahack; owned the full frontend.",
    pull: "“Meet the business where it already lives — inside WhatsApp.”", // TODO: replace with your own line
    stack: ["Python", "Flask", "Firebase Firestore", "Gemini API", "WhatsApp Business API", "Railway"],
    link: null, // TODO: repo link if public
    year: "2026",
    visuals: [
      { no: "4.1", caption: "Message flow, WhatsApp to advisory", el: <PipelineDiagram title="ARCHITECTURE" steps={["WhatsApp Message", "Webhook (Flask)", "Firestore Records", "Gemini Analysis", "Reply + Dashboard"]} /> },
    ],
  },
  {
    id: "doctelemy",
    no: "05",
    importance: "feature",
    kicker: "FEATURE STORY · AI × RURAL HEALTHCARE",
    name: "DocTeleMY",
    dek: "An offline-first AI triage app for rural Malaysia — clinical decision support that keeps working when the connection doesn't.",
    problem: "Rural clinics and patients can't rely on connectivity, so most telehealth tools fail exactly where they're needed most.", // TODO: your words
    tech: "Flutter app with SQLite for local-first data persistence and Firebase for cloud sync when connectivity allows. Gemini API integration provides real-time clinical decision support for triage.",
    impact: "Built for KitaHack 2026 as an AI healthcare solution targeting low-connectivity environments.",
    pull: "“Offline-first isn't a feature here — it's the whole point.”", // TODO: replace with your own line
    stack: ["Flutter", "Firebase", "SQLite", "Gemini API"],
    link: null, // TODO
    year: "2026",
    visuals: [
      { no: "5.1", caption: "Sync path, device-local to cloud", el: <PipelineDiagram title="OFFLINE-FIRST FLOW" steps={["Patient Input", "SQLite (Local)", "Gemini Triage", "Firebase Sync", "Clinic Dashboard"]} /> },
    ],
  },
  {
    id: "foodies",
    no: "07",
    importance: "note",
    kicker: "ENGINEERING NOTES · MOBILE",
    name: "Foodies",
    dek: "A Java Android app for community food sharing, with live maps and real-time transactions.",
    problem: "Surplus food and the people who could use it rarely find each other in time.", // TODO: your words
    tech: "Java Android app (Android Studio) with OSMDroid for real-time map integration and Firebase Realtime Database handling live transactions and user data.",
    impact: "Built for the Mobile Application Development course (Jan 2026).",
    pull: "“Real-time maps, real-time claims — before the food goes cold.”", // TODO
    stack: ["Java", "Android Studio", "Firebase", "OSMDroid"],
    link: null, // TODO
    year: "2026",
  },
  {
    id: "alzheimers-iot",
    no: "08",
    importance: "note",
    kicker: "ENGINEERING NOTES · ARCHITECTURE",
    name: "Alzheimer's Care IoT System",
    dek: "Architecture for a smart IoT safety and health monitoring platform for Alzheimer's patients — designed before a line of code.",
    problem: "A multi-stakeholder healthcare platform fails without a clear modular structure agreed upfront.", // TODO: your words
    tech: "System architecture defined through UML Package and Component diagrams, with component-level interaction models specifying how patient devices, caregivers, and clinicians connect.",
    impact: "Software Architecture & Design coursework (Jan 2026) — full architectural documentation for a multi-stakeholder platform.",
    pull: "“Architecture is the part you can't refactor later.”", // TODO
    stack: ["UML", "System Architecture", "Component Design"],
    link: null,
    year: "2026",
  },
  {
    id: "marz-tamam-db",
    no: "09",
    importance: "note",
    kicker: "ENGINEERING NOTES · DATA",
    name: "MARZ TAMAM Inventory System",
    dek: "A database-driven inventory and booking system for a real enterprise, built in Oracle APEX.",
    problem: "TODO — one sentence on what the business needed.",
    tech: "Full relational design in Oracle APEX with PK/FK constraints, normalization, and SQL reporting for inventory and bookings.",
    impact: "Delivered for MARZ TAMAM ENTERPRISE (Dec 2025) as Database Systems coursework with a real client.",
    pull: "“TODO — a line of yours.”",
    stack: ["Oracle APEX", "SQL", "Relational Design"],
    link: null,
    year: "2025",
  },
];
