import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fails fast and points at the fix, instead of a cryptic fetch error later.
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — copy .env.example to .env.local and fill them in."
  );
}

/* Safe to expose in the browser: the anon key can only do what schema.sql's
   RLS policies allow (public read, write only when signed in as the admin). */
export const supabase = createClient(url, anonKey);
