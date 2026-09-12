import useSupabaseTable from "./useSupabaseTable";

/* Same shape the components already expect (FeaturesSection,
   CoverStory, ProjectOverlay etc. don't need to change — the only
   mismatch is the DB's snake_case cover_story column, mapped here to the
   coverStory prop those components already expect. */
export default function useProjectsData() {
  const { data: rows, loading, error } = useSupabaseTable("projects");
  const projects = rows.map(({ cover_story, ...row }) => ({ ...row, coverStory: cover_story }));
  const projectIds = projects.map((project) => project.id);
  const coverProject = projects.find((project) => project.importance === "cover");
  return { projects, projectIds, coverProject, loading, error };
}
