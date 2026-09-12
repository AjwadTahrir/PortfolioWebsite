import StatusNote from "../ui/StatusNote";
import useStatsData from "../../hooks/cms/useStatsData";
import EditorialSection from "../layout/EditorialSection";
import "./StatsSection.css";

export default function StatsSection() {
  const { stats, loading, error } = useStatsData();

  return (
    <EditorialSection id="notes" no="02" kicker="ENGINEERING NOTES" breakLabel="ENGINEERING NOTES" title="By the numbers" className="stats">
      {stats.length ? (
        <div className="stats__grid" style={{ "--stat-count": stats.length }}>
          {stats.map(({ id, value, label }) => (
            <div key={id} className="stat">
              <div className="stat__value">{value}</div>
              <div className="stat__label mono">{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <StatusNote loading={loading} error={error} emptyLabel="NO STATS YET" />
      )}
    </EditorialSection>
  );
}
