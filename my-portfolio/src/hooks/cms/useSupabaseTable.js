import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

/* Fetches every row of `table`, ordered by sort_order, and keeps it live:
   any insert/update/delete on the table (from /admin, in this tab or any
   other) patches local state immediately via Supabase Realtime, so an edit
   shows up on the public site without a page reload.

   Returns { data, loading, error }. `data` is [] (not undefined) while
   loading, so callers can render straight away. */
export default function useSupabaseTable(table) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data: rows, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) setError(fetchError);
        else setData(rows);
        setLoading(false);
      });

    const channel = supabase
      .channel(`${table}-changes`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        // A single row's diff is fiddly to apply correctly (inserts need
        // re-sorting, etc.); since these tables are small, just refetch.
        supabase
          .from(table)
          .select("*")
          .order("sort_order", { ascending: true })
          .then(({ data: rows, error: fetchError }) => {
            if (cancelled) return;
            if (fetchError) setError(fetchError);
            else setData(rows);
          });
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { data, loading, error };
}
