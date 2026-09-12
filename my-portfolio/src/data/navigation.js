/* Running-header navigation. `id` must match a section's DOM id;
   `no` is the magazine page number shown beside the label. */
export const NAV_ITEMS = [
  { id: "author", label: "Profile", no: "00" },
  { id: "features", label: "Features", no: "01" },
  { id: "notes", label: "Notes", no: "02" },
  { id: "log", label: "Chronicles", no: "03" },
  { id: "blueprint", label: "Blueprint", no: "04" },
  { id: "reports", label: "Reports", no: "05" },
  { id: "index", label: "Stack", no: "06" },
  { id: "letters", label: "Letters", no: "07" },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
