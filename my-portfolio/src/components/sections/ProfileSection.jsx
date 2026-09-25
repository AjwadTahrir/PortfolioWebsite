import { useState } from "react";
import { SITE } from "../../constants/site";
import "./ProfileSection.css";

const FACTS = [
  { label: "Based in", value: "Petaling Jaya, Malaysia" },
  { label: "Studying", value: "Software Engineering, Universiti Malaya" },
  { label: "Focus", value: "AI × Cloud × Product Engineering" },
  { label: "Open to", value: "Internships, hackathons, engineering projects" },
];

/* The first page after the cover: who wrote this issue. */
export default function ProfileSection() {
  const [portraitMissing, setPortraitMissing] = useState(false);

  return (
    <section id="author" className="profile snap-page">
      <figure className="profile__figure">
        <div className="profile__portrait">
          {portraitMissing ? (
            <div className="profile__portrait-fallback">Drop a portrait at /public/portrait.jpg</div>
          ) : (
            <img
              className="profile__portrait-img"
              src="/portrait.jpg"
              alt="Portrait of Ajwad Tahrir"
              onError={() => setPortraitMissing(true)}
            />
          )}
        </div>
        <figcaption className="profile__caption">{SITE.displayName}, {SITE.cityName}</figcaption>
      </figure>

      <div className="profile__text">
        <h2 className="headline profile__name">Ajwad Tahrir</h2>
        <p className="profile__lede">
          Builds software where artificial intelligence meets physical problems. From satellite
          imagery monitoring farmland to full-stack systems built for teams, the work explores how
          technology can create measurable impact.
        </p>
        <p className="body-p profile__philosophy">
          Working software over theoretical completeness: specify carefully, build quickly, ship what matters.
        </p>
        <dl className="profile__facts">
          {FACTS.map(({ label, value }) => (
            <div key={label} className="profile__fact">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
