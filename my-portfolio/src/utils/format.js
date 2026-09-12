/* 3 -> "03": magazine-style counters and indices. */
export function padNumber(value) {
  return String(value).padStart(2, "0");
}

/* "12 September 2026", Malaysian English. */
export function formatIssueDate(date) {
  return date.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
}
