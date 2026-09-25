import { Fragment } from "react";
import StatusNote from "../ui/StatusNote";
import useReportsData from "../../hooks/cms/useReportsData";
import { groupByYear, metaOf } from "../../data/reports";
import { titleCase } from "../../utils/format";
import EditorialSection from "../layout/EditorialSection";
import "./ReportsSection.css";

/* The report ledger: a record of evidence. Each entry is a numbered row with
   the event, the outcome as the headline, one line of supporting detail, the
   year, and a link to the related project. Numbers run through the whole
   ledger; year headings appear only when the entries span several years. */
export default function ReportsSection({ projects = [], onOpenProject }) {
  const { reports, loading, error } = useReportsData();

  const entries = reports.map((report, i) => {
    const meta = metaOf(report.title);
    const [headline, ...detail] = report.outcomes;
    const project = projects.find((p) => p.id.toLowerCase() === meta.project);
    return { id: report.id, no: String(i + 1).padStart(2, "0"), event: titleCase(report.title), headline, detail, year: meta.year, project };
  });
  const showHeadings = new Set(entries.map((e) => e.year).filter(Boolean)).size > 1;
  // One list in database order, unless the entries span several years and get year headings.
  const groups = showHeadings ? groupByYear(entries) : [{ year: "", items: entries }];

  return (
    <EditorialSection id="reports" title="Field reports" deck="Outcomes, verified." className="reports">
      {entries.length ? (
        <div className="ledger">
          {groups.map(({ year, items }) => (
            <Fragment key={year || "undated"}>
              {showHeadings && <h3 className="ledger__year">{year || "Undated"}</h3>}
              <ol className="ledger__list">
                {items.map((entry) => (
                  <li key={entry.id} className="entry">
                    <span className="entry__no">{entry.no}</span>
                    <span className="entry__event">{entry.event}</span>
                    <div className="entry__body">
                      <h4 className="entry__outcome">{entry.headline}</h4>
                      {entry.detail.length > 0 && <p className="entry__detail">{entry.detail.join(". ")}</p>}
                      {entry.project && onOpenProject && (
                        <button className="entry__link" onClick={() => onOpenProject(entry.project.id)}>
                          Related: {entry.project.name}
                        </button>
                      )}
                    </div>
                    <span className="entry__year">{entry.year}</span>
                  </li>
                ))}
              </ol>
            </Fragment>
          ))}
        </div>
      ) : (
        <StatusNote loading={loading} error={error} emptyLabel="NO REPORTS YET" />
      )}
    </EditorialSection>
  );
}
