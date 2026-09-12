import useSupabaseTable from "./useSupabaseTable";

export default function useReportsData() {
  const { data: reports, loading, error } = useSupabaseTable("reports");
  return { reports, loading, error };
}
