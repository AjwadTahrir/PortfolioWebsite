import { useState } from "react";
import { SITE } from "../../constants/site";
import PageFoot from "../layout/PageFoot";
import Reveal from "../ui/Reveal";
import "./ProfileSection.css";

const FACTS = [
  { label: "LOCATION", value: "Petaling Jaya, Malaysia" },
  { label: "EDUCATION", value: "Software Engineering, Universiti Malaya" },
  { label: "CURRENT FOCUS", value: "AI × Cloud × Product Engineering" },
  { label: "OPEN TO", value: "Internships · Hackathons · Engineering projects" },
];

export default function ProfileSection() {
  const [portraitMissing, setPortraitMissing] = useState(false);

  return (
    <section id="author" className="wrap profile">
      <Reveal>
        <div className="kicker">00 · THE PROFILE</div>
        <div className="profile__grid">
          <figure className="profile__figure">
            <div className="profile__portrait">
              {portraitMissing ? (
                <div className="profile__portrait-fallback mono">DROP /public/portrait.jpg</div>
              ) : (
                <img
                  className="profile__portrait-img"
                  src="/portrait.jpg"
                  alt="Portrait of Ajwad Tahrir"
                  onError={() => setPortraitMissing(true)}
                />
              )}
            </div>
            <figcaption className="profile__caption mono">{SITE.name}, {SITE.city}</figcaption>
          </figure>

          <div>
            <h2 className="headline profile__name">Ajwad Tahrir</h2>
            <p className="body-p profile__lede">
              Ajwad Tahrir builds software where artificial intelligence meets physical problems.
              From satellite imagery monitoring farmland to full-stack systems built for teams,
              his work explores how technology can create measurable impact.
            </p>
            <p className="body-p profile__philosophy">
              Engineering philosophy: working software over theoretical completeness —
              specify carefully, build quickly, ship what matters.
            </p>
          </div>

          <div className="profile__facts">
            {FACTS.map(({ label, value }) => (
              <div key={label} className="profile__fact mono">
                <b>{label}</b> — {value}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <PageFoot no="00" />
    </section>
  );
}
