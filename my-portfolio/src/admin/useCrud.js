import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";

/* Insert/update/delete against `table`, with a per-row `saving` id and a
   single shared error message. Reads are handled separately by the
   hooks/cms/ hooks (which also power the public pages) — Realtime means
   a write made here shows up there without any extra plumbing. */
export default function useCrud(table) {
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (id, fn) => {
      setSavingId(id);
      setError(null);
      const { error: opError } = await fn();
      setSavingId(null);
      if (opError) setError(opError.message);
      return !opError;
    },
    []
  );

  const insert = useCallback((row) => run("new", () => supabase.from(table).insert(row)), [run, table]);
  const update = useCallback((id, patch) => run(id, () => supabase.from(table).update(patch).eq("id", id)), [run, table]);
  const remove = useCallback((id) => run(id, () => supabase.from(table).delete().eq("id", id)), [run, table]);

  return { insert, update, remove, savingId, error };
}
