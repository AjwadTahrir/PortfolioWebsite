import { useEffect, useRef, useState } from "react";
import ContentsOverlay from "../components/issue/ContentsOverlay";
import CoverPage from "../components/issue/CoverPage";
import RunningHead from "../components/issue/RunningHead";
import BlueprintSection from "../components/sections/BlueprintSection";
import ChroniclesSection from "../components/sections/ChroniclesSection";
import EditorsLetter from "../components/sections/EditorsLetter";
import LettersSection from "../components/sections/LettersSection";
import ProfileSection from "../components/sections/ProfileSection";
import ReportsSection from "../components/sections/ReportsSection";
import StackIndexSection from "../components/sections/StackIndexSection";
import ArchiveSection from "../features/archive/ArchiveSection";
import WorkSection from "../features/projects/WorkSection";
import Newswire from "../features/projects/Newswire";
import ProjectOverlay from "../features/projects/ProjectOverlay";
import "../styles/issue.css";
import useProjectsData from "../hooks/cms/useProjectsData";
import useCoverProgress from "../hooks/useCoverProgress";
import useOpening from "../hooks/useOpening";
import useProjectRoute from "../hooks/useProjectRoute";

/* The website: the issue laid out top to bottom, in reading order.
   Projects, archive items, reports and stats come from Supabase (see
   hooks/cms/); an edit made in /admin appears here without a rebuild. */
export default function WebEdition({ onOpenPrintEdition }) {
  const rootRef = useRef(null);
  const isOpening = useOpening();
  const [isContentsOpen, setIsContentsOpen] = useState(false);
  useCoverProgress(rootRef);

  // Scopes the web edition's tokens (styles/tokens.css) to this page only.
  useEffect(() => {
    document.body.classList.add("web");
    return () => document.body.classList.remove("web");
  }, []);

  const { projects, projectIds, coverProject } = useProjectsData();
  const route = useProjectRoute(projectIds);
  const activeProject = projects.find((project) => project.id === route.activeId);

  return (
    <div ref={rootRef} className={`magazine${isOpening ? " is-opening" : ""}`}>
      <div className="paper-grain" aria-hidden="true" />
      <RunningHead onOpenContents={() => setIsContentsOpen(true)} />

      <CoverPage project={coverProject} />
      <Newswire onOpenProject={route.open} />

      <ProfileSection />
      <ArchiveSection />
      <EditorsLetter />

      <WorkSection projects={projects} onOpen={route.open} />
      <ChroniclesSection />
      <BlueprintSection />
      <ReportsSection projects={projects} onOpenProject={route.open} />
      <StackIndexSection />

      <LettersSection />

      {isContentsOpen && (
        <ContentsOverlay onClose={() => setIsContentsOpen(false)} onOpenPrintEdition={onOpenPrintEdition} />
      )}
      {activeProject && <ProjectOverlay key={activeProject.id} project={activeProject} onClose={route.close} />}
    </div>
  );
}
