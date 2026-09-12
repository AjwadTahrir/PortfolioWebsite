import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { CARD, FAINT, INK, RED } from "../../constants/colors";
import { TRAVELS } from "../../data/travels";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const PROJECTION = { scale: 220, center: [70, 5] };
const PIN_RADIUS = { home: 7, selected: 6.5, default: 4.5 };

function pinRadius(place, isSelected) {
  if (place.isHome) return PIN_RADIUS.home;
  return isSelected ? PIN_RADIUS.selected : PIN_RADIUS.default;
}

/* Travel map with a detail card; places can be picked on the map or from
   the list (the list is the keyboard/screen-reader route). */
export default function FieldNotesMap() {
  const [selected, setSelected] = useState(TRAVELS[0]);

  return (
    <div className="spread-grid archive-panel">
      <div className="field-notes__map" aria-hidden="true">
        <ComposableMap projection="geoMercator" projectionConfig={PROJECTION} style={{ width: "100%", height: "auto" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#EFEBE3" stroke={FAINT} strokeWidth={0.5} />
              ))
            }
          </Geographies>
          {TRAVELS.map((place) => {
            const isSelected = place.id === selected.id;
            return (
              <Marker key={place.id} coordinates={[place.lon, place.lat]} onClick={() => setSelected(place)}>
                <circle
                  r={pinRadius(place, isSelected)}
                  fill={isSelected ? RED : INK}
                  stroke={CARD}
                  strokeWidth={1.5}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      <div>
        <div className="archive-card field-notes__card" aria-live="polite">
          <div className="field-notes__year mono">{selected.year}</div>
          <div className="field-notes__place">{selected.label}</div>
          {selected.days && <div className="field-notes__days mono">{selected.days} DAYS</div>}
          <p className="body-p field-notes__note">{selected.note}</p>
        </div>

        <div className="field-notes__places">
          {TRAVELS.map((place) => {
            const isSelected = place.id === selected.id;
            return (
              <button
                key={place.id}
                className={`field-notes__place-btn mono${isSelected ? " is-selected" : ""}`}
                aria-pressed={isSelected}
                onClick={() => setSelected(place)}
              >
                {place.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
