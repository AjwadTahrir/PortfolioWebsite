/* Campus Life (the Archive's "university" tile). Static, personal content —
   not CMS-edited, unlike the tile's own kicker/title/dek in Supabase. */

export const CAMPUS_STAGE = {
  eyebrow: "2024 → Now",
  heading: "Software Engineering",
  paragraphs: [
    "Started at Universiti Malaya with a simple goal: learn how to build things properly.",
    "Two years in, that has meant algorithms, databases, machine learning, software architecture, mobile development, requirements, and a lot of time figuring things out with other people.",
  ],
  credits: "79",
  cgpa: "3.62",
};

export const COURSE_LEVELS = [
  {
    label: "Level 1",
    courses: ["Programming", "Data Structures", "Computer Systems", "HCI", "Mathematics", "Networks", "Machine Learning"],
  },
  {
    label: "Level 2",
    courses: [
      "Database", "Software Modelling", "Probability & Statistics", "Mobile Development", "Operating Systems",
      "Algorithms", "Project Management", "Software Requirements", "Web Programming", "Software Architecture",
    ],
  },
  {
    label: "Next",
    courses: [
      "Academic Projects", "Software Maintenance", "Programming Paradigms", "Real-Time Systems",
      "Component-Based Engineering", "Scientific Computing", "Software Testing", "Concurrent & Parallel Programming",
    ],
  },
];

export const SUBJECTS = [
  { code: "WIA1006", name: "Machine Learning", note: "My first formal introduction to machine learning." },
  { code: "WIA2007", name: "Mobile Application Development", note: "Learning to build software for a different kind of interface." },
  { code: "WIF2002", name: "Software Requirements Engineering", note: "Understanding that good software starts before the first line of code." },
  { code: "WIF2003", name: "Web Programming", note: "Turning ideas into systems that people can actually use." },
  { code: "WIF3004", name: "Software Architecture & Design Paradigms", note: "Learning to think about the structure behind the software, not just the features." },
];

export const CAMPUS_BUILDS = [
  { name: "Pet Health Records", note: "Digital pet health records and appointment management." },
  { name: "FitTrack", note: "A multi-user health and fitness platform." },
  { name: "MARZ TAMAM", note: "A database system for a family-run canopy and catering business." },
];

/* Newest last, so the final node (styled current) reads as "today". */
export const CAMPUS_MOMENTS = [
  { time: "08:13 AM", label: "First class." },
  { time: "11:47 PM", label: "Still debugging." },
  { time: "Deadline − 2 days", label: "Everyone suddenly becomes very productive." },
  { time: "Weekend", label: "Hackathon." },
  { time: "Monday", label: "Back to class." },
];
