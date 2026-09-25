/* 3 -> "03": magazine-style counters and indices. */
export function padNumber(value) {
  return String(value).padStart(2, "0");
}

/* "12 September 2026", Malaysian English. */
export function formatIssueDate(date) {
  return date.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
}

/* Labels are stored in capitals ("AI SYSTEMS ERA"); show them as sentences
   ("AI systems era"), keeping known acronyms in capitals. */
const ACRONYMS = new Set(["AI", "ML", "IOT", "LLM", "API", "UI", "SMS", "JWT", "GB", "UM", "PASUM", "KM"]);
export function sentenceCase(text) {
  const words = text.split(" ").map((word) => (ACRONYMS.has(word) ? word : word.toLowerCase()));
  const first = words[0];
  if (first && !ACRONYMS.has(text.split(" ")[0])) words[0] = first.charAt(0).toUpperCase() + first.slice(1);
  return words.join(" ");
}

/* Event and programme names are proper nouns: "SHORTCUT ASIA CHALLENGE 2026"
   becomes "Shortcut Asia Challenge 2026", with known brand spellings kept. */
const BRAND_SPELLINGS = { BORNEOHACK: "BorneoHack", KITAHACK: "KitaHack", UMHACKATHON: "UMHackathon", XTALENT: "XTalent" };
export function titleCase(text) {
  return text
    .split(" ")
    .map((word) => BRAND_SPELLINGS[word] ?? (/^[A-Z]{2,}$/.test(word) && word.length <= 3 ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .join(" ");
}
