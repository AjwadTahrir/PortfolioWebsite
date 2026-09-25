import { useRef } from "react";
import { ERAS } from "../../data/eras";
import useRoadProgress from "../../hooks/useRoadProgress";
import { sentenceCase } from "../../utils/format";
import EditorialSection from "../layout/EditorialSection";
import "./ChroniclesSection.css";

/* The data is newest first; a route reads from where it started. */
const JOURNEY = [...ERAS].reverse();

/* Geometry of the winding road, in SVG units (viewBox is 1000 wide). One row
   per year; the road runs right, U-turns, runs left, U-turns, and so on. */
const X_LEFT = 120;
const X_RIGHT = 880;
const RADIUS = 130; // half the row spacing, so each U-turn is a semicircle
const ROW = RADIUS * 2;
const STRAIGHT = X_RIGHT - X_LEFT;
const ARC = Math.PI * RADIUS;
const HEIGHT = ROW * JOURNEY.length;
const TOTAL_LENGTH = JOURNEY.length * STRAIGHT + (JOURNEY.length - 1) * ARC;
// The road is longer per row than the page is tall per row; this keeps the fill in step with scroll.
const PATH_SCALE = (JOURNEY.length * (STRAIGHT + ARC)) / TOTAL_LENGTH;

const rowY = (row) => RADIUS + row * ROW;
const goesRight = (row) => row % 2 === 0;
const startX = (row) => (goesRight(row) ? X_LEFT : X_RIGHT);
/* x at a fraction u (0 to 1) along a row's straight run. */
const xAt = (row, u) => startX(row) + (goesRight(row) ? 1 : -1) * STRAIGHT * u;
/* Position along the whole path (0 to 1) at fraction u of a row's straight run. */
const pathAt = (row, u) => (row * (STRAIGHT + ARC) + STRAIGHT * u) / TOTAL_LENGTH;

const ROAD_PATH = JOURNEY.map((_, row) => {
  const y = rowY(row);
  const isLast = row === JOURNEY.length - 1;
  const run = `${row === 0 ? `M${X_LEFT} ${y} ` : ""}H${goesRight(row) ? X_RIGHT : X_LEFT}`;
  if (isLast) return run;
  const nextY = y + ROW;
  return `${run} A${RADIUS} ${RADIUS} 0 0 ${goesRight(row) ? 1 : 0} ${goesRight(row) ? X_RIGHT : X_LEFT} ${nextY}`;
}).join(" ");

const place = (x, y) => ({ left: `${x / 10}%`, top: `${(y / HEIGHT) * 100}%` });

/* Desktop: the winding road. Labels are HTML placed at the same coordinates
   as the SVG path, so text stays crisp and selectable. */
function WindingRoad() {
  const stops = [];
  JOURNEY.forEach(({ year, era, milestones }, row) => {
    const y = rowY(row);
    stops.push(
      <div key={`s-${year}`} className="road__stop road__station" data-p={pathAt(row, 0)} style={place(startX(row), y)}>
        <span className="road__node road__node--station" aria-hidden="true" />
        <div className={`road__station-label road__station-label--${goesRight(row) ? "l" : "r"}`}>
          <div className="road__year">{year}</div>
          <div className="road__era-name">{sentenceCase(era)}</div>
        </div>
      </div>
    );
    milestones.forEach(({ name, tag }, k) => {
      const u = 0.24 + (0.68 * (k + 0.5)) / milestones.length;
      stops.push(
        <div
          key={`m-${year}-${name}`}
          className={`road__stop road__milestone road__milestone--${k % 2 ? "above" : "below"}`}
          data-p={pathAt(row, u)}
          style={place(xAt(row, u), y)}
        >
          <span className="road__node" aria-hidden="true" />
          <div className="road__label">
            <div className="road__milestone-name">{name}</div>
            <div className="road__milestone-tag">{tag}</div>
          </div>
        </div>
      );
    });
  });

  const lastRow = JOURNEY.length - 1;
  stops.push(
    <div key="here" className="road__stop road__here" data-p="1" style={place(xAt(lastRow, 1), rowY(lastRow))}>
      <span className="road__node road__node--here" aria-hidden="true" />
      <span className="road__here-label">You are here</span>
    </div>
  );

  return (
    <div className="road road--winding" style={{ aspectRatio: `1000 / ${HEIGHT}` }}>
      <svg className="road__svg" viewBox={`0 0 1000 ${HEIGHT}`} aria-hidden="true">
        <path className="road__line" d={ROAD_PATH} />
        <path className="road__fill" d={ROAD_PATH} pathLength="1" />
      </svg>
      {stops}
    </div>
  );
}

/* Small screens: a straight road down the left edge, same content. */
function ListRoad() {
  return (
    <ol className="road road--list">
      <span className="road__line-v" aria-hidden="true" />
      <span className="road__fill-v" aria-hidden="true" />
      {JOURNEY.map(({ year, era, milestones }) => (
        <li key={year} className="road__era">
          <div className="road__stop road__station-v">
            <span className="road__node road__node--station" aria-hidden="true" />
            <div className="road__year">{year}</div>
            <div className="road__era-name">{sentenceCase(era)}</div>
          </div>
          <ul className="road__stops-v">
            {milestones.map(({ name, tag }) => (
              <li key={name} className="road__stop road__milestone-v">
                <span className="road__node" aria-hidden="true" />
                <div className="road__milestone-name">{name}</div>
                <div className="road__milestone-tag">{tag}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/* The chronicles as a roadmap. On wide screens the road winds down the page
   in an S; the red route fills along it as you scroll and stops light up as
   you pass them. */
export default function ChroniclesSection() {
  const roadRef = useRef(null);
  useRoadProgress(roadRef, { pathScale: PATH_SCALE });

  return (
    <EditorialSection id="log" title="The chronicles" deck="Four years, start to now." className="chronicles">
      <div ref={roadRef} className="road-wrap">
        <WindingRoad />
        <ListRoad />
      </div>
    </EditorialSection>
  );
}
