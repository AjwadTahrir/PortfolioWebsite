import { useState } from "react";
import { SITE } from "../../constants/site";
import { PROFILE } from "../../data/profile";
import "./ProfileSection.css";

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
        <p className="profile__lede">{PROFILE.lede}</p>
        <p className="body-p profile__philosophy">{PROFILE.philosophy}</p>
        <dl className="profile__facts">
          {PROFILE.facts.map(({ label, value }) => (
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
