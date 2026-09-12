import useSupabaseTable from "./useSupabaseTable";

export default function useStatsData() {
  const { data: stats, loading, error } = useSupabaseTable("stats");
  return { stats, loading, error };
}
