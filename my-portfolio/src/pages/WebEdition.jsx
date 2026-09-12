import Masthead from "../components/layout/Masthead";
import NavBar from "../components/layout/NavBar";
import ProgressRule from "../components/layout/ProgressRule";
import BlueprintSection from "../components/sections/BlueprintSection";
import ChroniclesSection from "../components/sections/ChroniclesSection";
import EditorsLetter from "../components/sections/EditorsLetter";
import LettersSection from "../components/sections/LettersSection";
import ProfileSection from "../components/sections/ProfileSection";
import QuoteSpread from "../components/sections/QuoteSpread";
import ReportsSection from "../components/sections/ReportsSection";
import StackIndexSection from "../components/sections/StackIndexSection";
import StatsSection from "../components/sections/StatsSection";
import ArchiveSection from "../features/archive/ArchiveSection";
import CoverStory from "../features/projects/CoverStory";
import FeaturesSection from "../features/projects/FeaturesSection";
import Newswire from "../features/projects/Newswire";
import ProjectOverlay from "../features/projects/ProjectOverlay";
import useProjectsData from "../hooks/cms/useProjectsData";
import useProjectRoute from "../hooks/useProjectRoute";

/* The website: the issue laid out top to bottom, in reading order.
   Projects, archive items, reports and stats come from Supabase (see
   hooks/cms/); an edit made in /admin appears here without a rebuild. */
export default function WebEdition({ onOpenPrintEdition }) {
  const { projects, projectIds, coverProject } = useProjectsData();
  const route = useProjectRoute(projectIds);
  const activeProject = projects.find((project) => project.id === route.activeId);

  return (
    <div className="magazine">
      <div className="paper-grain" aria-hidden="true" />
      <ProgressRule />

      <Masthead onOpenPrintEdition={onOpenPrintEdition} />
      <NavBar />

      {coverProject && <CoverStory project={coverProject} onOpen={route.open} />}
      <Newswire onOpenProject={route.open} />

      <ProfileSection />
      <div className="wrap"><div className="rule-thick front-rule" /></div>
      <ArchiveSection />
      <div className="wrap"><div className="rule" /></div>
      <EditorsLetter />

      <FeaturesSection projects={projects} onOpen={route.open} />
      <QuoteSpread
        quote="“Yesterday is history, tomorrow is a mystery, but today is a gift”"
        credit="— MASTER OOGWAY"
      />
      <StatsSection />
      <ChroniclesSection />
      <BlueprintSection />
      <ReportsSection />
      <StackIndexSection />
      <LettersSection />

      {activeProject && <ProjectOverlay key={activeProject.id} project={activeProject} onClose={route.close} />}
    </div>
  );
}
