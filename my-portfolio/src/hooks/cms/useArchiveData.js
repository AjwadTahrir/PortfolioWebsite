import useSupabaseTable from "./useSupabaseTable";

export default function useArchiveData() {
  const { data: archive, loading, error } = useSupabaseTable("archive_items");
  return { archive, loading, error };
}
