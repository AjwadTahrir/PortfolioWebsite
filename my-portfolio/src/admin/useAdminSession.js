import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/* Tracks the Supabase auth session. There's no public signup screen —
   your one admin account is created by hand in the Supabase dashboard
   (Authentication → Users → Add user) — so a non-null session always
   means it's you. */
export default function useAdminSession() {
  const [session, setSession] = useState(undefined); // undefined = "still checking"

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return session;
}
