/* Identity and contact details used across the web and print editions. */
export const SITE = {
  name: "AJWAD TAHRIR",
  displayName: "Ajwad Tahrir", // for running text; `name` is the masthead's capitals
  cityName: "Kuala Lumpur",
  issue: "ISSUE 01",
  volume: "VOL. 01",
  city: "KUALA LUMPUR",
  email: "Ajwad200514@gmail.com",
  githubUrl: "https://github.com/AjwadTahrir",
  githubLabel: "github.com/AjwadTahrir",
  linkedinUrl: "http://linkedin.com/in/ajwad-mohd-tahrir/", 
  url: import.meta.env.VITE_SITE_URL || "[site URL]", // set VITE_SITE_URL at deploy
};

/* "AJWAD TAHRIR · ISSUE 01" — the running folio on every page. */
export const FOLIO = `${SITE.name} · ${SITE.issue}`;
