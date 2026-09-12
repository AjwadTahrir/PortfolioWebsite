import { useEffect, useState } from "react";

/* Today's date, refreshed at midnight. Only the date is ever displayed,
   so there's no reason to re-render more often than once a day. */
export default function useToday() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const nextMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const timer = setTimeout(() => setToday(new Date()), nextMidnight - Date.now() + 1000);
    return () => clearTimeout(timer);
  }, [today]);

  return today;
}
