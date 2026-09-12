import StatusNote from "../ui/StatusNote";
import useReportsData from "../../hooks/cms/useReportsData";
import EditorialSection from "../layout/EditorialSection";
import "./ReportsSection.css";

export default function ReportsSection() {
  const { reports, loading, error } = useReportsData();

  return (
    <EditorialSection id="reports" no="05" kicker="FIELD REPORTS" breakLabel="FIELD REPORTS" title="Verified outcomes" className="reports">
      {reports.length ? (
        <div className="reports__grid">
          {reports.map(({ id, title, outcomes }) => (
            <div key={id} className="report">
              <div className="report__title mono">{title}</div>
              <ul className="report__outcomes">
                {outcomes.map((outcome) => (
                  <li key={outcome} className="report__outcome">
                    <span className="report__check" aria-hidden="true">✓</span><span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <StatusNote loading={loading} error={error} emptyLabel="NO REPORTS YET" />
      )}
    </EditorialSection>
  );
}
