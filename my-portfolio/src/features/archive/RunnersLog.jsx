import { DISTANCE_GOAL_KM, PERSONAL_BESTS, RUN_MILESTONES, TOTAL_DISTANCE_KM } from "../../data/runs";
import { padNumber } from "../../utils/format";

export default function RunnersLog() {
  const goalPercent = Math.min(100, (TOTAL_DISTANCE_KM / DISTANCE_GOAL_KM) * 100);

  return (
    <div className="spread-grid archive-panel">
      <div className="archive-card runners-log__card">
        <div className="runners-log__heading mono">PERSONAL BESTS</div>
        {PERSONAL_BESTS.map(({ distance, time }) => (
          <div key={distance} className="runners-log__pb">
            <span className="runners-log__distance">{distance}</span>
            <span className="runners-log__time mono">{time}</span>
          </div>
        ))}
          <div className="runners-log__distance-head">
            <span className="runners-log__heading mono">TOTAL DISTANCE </span>
            <span className="runners-log__km mono">
              <span className="runners-log__km-done">{TOTAL_DISTANCE_KM.toLocaleString()} KM</span>
              {" / "}
              {DISTANCE_GOAL_KM.toLocaleString()} KM
            </span>
        </div>
        <div
          className="runners-log__track"
          role="progressbar"
          aria-label={`${TOTAL_DISTANCE_KM} of ${DISTANCE_GOAL_KM} km`}
          aria-valuenow={Math.round(goalPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="runners-log__fill" style={{ width: `${goalPercent}%` }} />
        </div>
      </div>

      <ol className="runners-log__milestones">
        {RUN_MILESTONES.map((milestone, i) => (
          <li key={milestone} className="runners-log__milestone">
            <span className="runners-log__index mono">{padNumber(i + 1)}</span>
            <span className="runners-log__node" aria-hidden="true" />
            <span className="runners-log__label">{milestone}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
