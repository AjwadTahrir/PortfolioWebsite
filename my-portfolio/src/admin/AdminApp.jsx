import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin.css";
import ArchiveEditor from "./components/ArchiveEditor";
import LoginForm from "./components/LoginForm";
import ProjectsEditor from "./components/ProjectsEditor";
import ReportsStatsEditor from "./components/ReportsStatsEditor";
import useAdminSession from "./useAdminSession";

const TABS = [
  { id: "projects", label: "Projects", Component: ProjectsEditor },
  { id: "archive", label: "Archive", Component: ArchiveEditor },
  { id: "reports-stats", label: "Reports & Stats", Component: ReportsStatsEditor },
];

/* Everything under /admin. Gated by Supabase Auth; signed out (or still
   checking) shows the login form instead of any editor. */
export default function AdminApp() {
  const session = useAdminSession();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  if (session === undefined) {
    return <div className="admin-shell admin-shell--centered mono">CHECKING SESSION…</div>;
  }
  if (session === null) {
    return <LoginForm />;
  }

  const ActiveEditor = TABS.find((tab) => tab.id === activeTab).Component;

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <span className="admin-topbar__title mono">ADMIN — {session.user.email}</span>
        <button className="admin-btn admin-btn--ghost" onClick={() => supabase.auth.signOut()}>
          SIGN OUT
        </button>
      </header>
      <nav className="admin-tabs mono">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`admin-tab${activeTab === id ? " is-active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="admin-content">
        <ActiveEditor />
      </main>
    </div>
  );
}
