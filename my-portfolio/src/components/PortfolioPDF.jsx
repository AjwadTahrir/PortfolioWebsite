import { Document, Page, Text, View, Link, Image, StyleSheet } from "@react-pdf/renderer";
import { SITE } from "../constants/site";
import { INK, PAPER, RED, GREY, FAINT } from "../constants/colors";
import { PROFILE } from "../data/profile";
import { SKILLS } from "../data/skills";
import { taglineOf } from "../data/work";

/* The downloadable portfolio: an A4 document built from the same data as
   the site (live project rows are passed in by DownloadPortfolioButton).
   Built-in Helvetica only, so every string goes through plain() first. */
export default function PortfolioPDF({ projects, generatedAt = new Date() }) {
  const monthYear = generatedAt.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <Document title={`${SITE.displayName} - Portfolio`} author={SITE.displayName}>
      <Page size="A4" style={styles.page}>
        <View style={styles.footer} fixed>
          <Text>Generated from {plain(SITE.url)} {"•"} {monthYear}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

        {/* No inherited lineHeight anywhere: set on the page, react-pdf drops
            the fixed footer; inherited from a View, it misspaces small text.
            Multi-line styles (body, rowValue) set their own. */}
        <View>
          <Header />

          <Section title="About">
            <Text style={styles.body}>{plain(PROFILE.lede)}</Text>
            <Text style={[styles.body, styles.philosophy]}>{plain(PROFILE.philosophy)}</Text>
          </Section>

          <Section title="Skills">
            {skillGroups().map(([category, names]) => (
              <Row key={category} label={category}>{names.join(", ")}</Row>
            ))}
          </Section>

          <Section title="Selected work">
            {projects.map((project, i) => <Project key={project.id} project={project} isFirst={i === 0} />)}
          </Section>
        </View>
      </Page>
    </Document>
  );
}

function Header() {
  const contacts = [
    { label: SITE.email, href: `mailto:${SITE.email}`, show: isFilled(SITE.email) },
    { label: SITE.githubLabel, href: SITE.githubUrl, show: isFilled(SITE.githubUrl) },
    { label: displayUrl(SITE.linkedinUrl), href: SITE.linkedinUrl, show: isFilled(SITE.linkedinUrl) },
    // The site URL always shows, even as "[site URL]", so a missing value is visible.
    { label: displayUrl(SITE.url), href: isFilled(SITE.url) ? SITE.url : null, show: true },
  ].filter((item) => item.show);
  const subtitle = [PROFILE.title, PROFILE.university].filter(isFilled).join("  /  ");

  return (
    <View style={styles.header}>
      <Text style={styles.kicker}>Portfolio</Text>
      <Text style={styles.name}>{plain(SITE.displayName)}</Text>
      {subtitle && <Text style={styles.subtitle}>{plain(subtitle)}</Text>}
      <View style={styles.contacts}>
        {contacts.map(({ label, href }) =>
          href ? (
            <Link key={label} src={href} style={styles.contact}>{plain(label)}</Link>
          ) : (
            <Text key={label} style={styles.contact}>{plain(label)}</Text>
          ),
        )}
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} minPresenceAhead={60}>{title}</Text>
      {children}
    </View>
  );
}

/* One project; wrap={false} keeps it on a single page. */
function Project({ project, isFirst }) {
  const image = isRasterImage(project.image) ? project.image : null;

  return (
    <View style={[styles.project, isFirst && styles.projectFirst]} wrap={false}>
      <View style={styles.projectHead}>
        <Text style={styles.projectName}>{plain(project.name)}</Text>
        {project.year && <Text style={styles.projectYear}>{plain(project.year)}</Text>}
      </View>
      <Text style={styles.tagline}>{plain(taglineOf(project))}</Text>
      {image && <Image src={image} style={styles.image} />}
      <Row label="Role">{project.role || "[role]"}</Row>
      {project.stack?.length > 0 && <Row label="Stack">{project.stack.join(", ")}</Row>}
      {project.impact && <Row label="Result">{project.impact}</Row>}
      {project.link && <Row label="Code" href={project.link}>{displayUrl(project.link)}</Row>}
      {project.demo && <Row label="Demo" href={project.demo}>{displayUrl(project.demo)}</Row>}
    </View>
  );
}

function Row({ label, href, children }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{plain(label)}</Text>
      {href ? (
        <Link src={href} style={[styles.rowValue, styles.link]}>{plain(children)}</Link>
      ) : (
        <Text style={styles.rowValue}>{plain(children)}</Text>
      )}
    </View>
  );
}

/* SKILLS grouped by category, in the order categories first appear. */
function skillGroups() {
  const groups = new Map();
  for (const { name, cat } of SKILLS) groups.set(cat, [...(groups.get(cat) ?? []), name]);
  return [...groups];
}

/* Empty, "#", example addresses and "[...]" placeholders count as unset. */
function isFilled(value) {
  return Boolean(value) && value !== "#" && !value.startsWith("[") && !value.includes("example.com");
}

function isRasterImage(url) {
  return typeof url === "string" && /^https?:\/\/.+\.(png|jpe?g)(\?.*)?$/i.test(url.trim());
}

/* "https://github.com/x/" -> "github.com/x" */
function displayUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

/* Helvetica's built-in encoding covers Latin-1 plus a little punctuation;
   swap the common exceptions and drop anything else (emoji, non-Latin). */
function plain(value) {
  return String(value ?? "")
    .replace(/[→⟶]/g, "->")
    .replace(/[←⟵]/g, "<-")
    .replace(/✓/g, "")
    .replace(/[^\n\x20-\x7E\xA0-\xFF–—‘’“”•…]/g, "")
    .replace(/ {2,}/g, " ");
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER, color: INK, fontFamily: "Helvetica", fontSize: 9.5,
    paddingTop: 48, paddingBottom: 64, paddingHorizontal: 52,
  },

  header: { borderBottomWidth: 2, borderBottomColor: INK, paddingBottom: 14, marginBottom: 6 },
  kicker: { fontFamily: "Helvetica-Oblique", fontSize: 11, color: RED },
  name: { fontFamily: "Helvetica-Bold", fontSize: 32, lineHeight: 1.05, marginTop: 4, textTransform: "uppercase" },
  subtitle: { fontSize: 11, marginTop: 6 },
  contacts: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  contact: { fontSize: 8.5, color: GREY, textDecoration: "none", marginRight: 16 },

  section: { marginTop: 18 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 1.2, textTransform: "uppercase",
    borderBottomWidth: 0.5, borderBottomColor: INK, paddingBottom: 4, marginBottom: 10,
  },
  body: { fontSize: 10.5, lineHeight: 1.5, maxWidth: 440 },
  philosophy: { fontFamily: "Helvetica-Oblique", marginTop: 6, color: GREY },

  project: { borderTopWidth: 0.5, borderTopColor: FAINT, paddingTop: 10, paddingBottom: 12 },
  projectFirst: { borderTopWidth: 0, paddingTop: 0 }, // the section rule already sits above it
  projectHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  projectName: { fontFamily: "Helvetica-Bold", fontSize: 14 },
  projectYear: { fontSize: 8.5, color: GREY },
  tagline: { fontFamily: "Helvetica-Oblique", fontSize: 10.5, marginTop: 2, marginBottom: 6 },
  image: { width: "100%", height: 150, objectFit: "cover", marginBottom: 8 },

  row: { flexDirection: "row", marginTop: 3 },
  rowLabel: { width: 78, fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.8, textTransform: "uppercase", color: GREY, paddingTop: 1.5 },
  rowValue: { flex: 1, lineHeight: "13.5pt" },
  link: { color: RED, textDecoration: "none" },

  footer: {
    position: "absolute", left: 52, right: 52, bottom: 28, flexDirection: "row", justifyContent: "space-between",
    borderTopWidth: 0.5, borderTopColor: FAINT, paddingTop: 6, fontSize: 7.5, color: GREY,
  },
});
