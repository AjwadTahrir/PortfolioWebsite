import { useState } from "react";
import AdminApp from "./admin/AdminApp";
import PrintEdition from "./pages/PrintEdition";
import WebEdition from "./pages/WebEdition";

const IS_ADMIN_PATH = window.location.pathname.replace(import.meta.env.BASE_URL, "").startsWith("admin");

/* The issue ships in two editions: the interactive website and a
   print-ready sheet. The masthead's PRINT EDITION button switches over.
   /admin is a separate app entirely (its own auth-gated editing UI over
   Supabase) — it's a path check, not a route library, in keeping with
   useProjectRoute doing the same for /projects/<id>. */
export default function App() {
  const [isPrintEdition, setIsPrintEdition] = useState(false);

  if (IS_ADMIN_PATH) return <AdminApp />;

  return isPrintEdition ? (
    <PrintEdition onClose={() => setIsPrintEdition(false)} />
  ) : (
    <WebEdition onOpenPrintEdition={() => setIsPrintEdition(true)} />
  );
}
