import React from "react";
import { ARCHIVE } from "../../data/archive";

function ArchiveTile({ item, onOpen }) {
  return (
    <button
      className={`feat-tile archive-tile archive-tile--${item.id}`}
      onClick={() => onOpen(item.id)}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="feat-tile__body" style={{ height: "100%", justifyContent: "flex-end" }}>
        <div className="feat-tile__label mono">{item.kicker}</div>
        <div className="feat-tile__name headline" style={{ fontSize: "clamp(20px,2.4vw,34px)" }}>
          {item.title}
        </div>
        <div className="feat-tile__dek">{item.dek}</div>
      </div>
    </button>
  );
}

export default function ArchiveGrid({ onOpen }) {
  return (
    <div className="archive-grid">
      {ARCHIVE.map((item) => (
        <ArchiveTile key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}