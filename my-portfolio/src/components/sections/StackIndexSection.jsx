import { useState } from "react";
import { SKILLS } from "../../data/skills";
import EditorialSection from "../layout/EditorialSection";
import "./StackIndexSection.css";

/* Index of technologies; hovering, focusing or clicking an entry shows its dossier. */
export default function StackIndexSection() {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS[0]);

  return (
    <EditorialSection id="index" no="06" kicker="REFERENCE" breakLabel="REFERENCE · THE STACK INDEX" title="The Stack Index" className="stack-index">
      <p className="stack-index__hint mono">HOVER AN ENTRY TO OPEN ITS DOSSIER</p>
      <div className="stack-index__grid">
        <div>
          {SKILLS.map((skill) => {
            const isSelected = skill.name === selectedSkill.name;
            const select = () => setSelectedSkill(skill);
            return (
              <button
                key={skill.name}
                className={`stack-entry${isSelected ? " is-selected" : ""}`}
                aria-pressed={isSelected}
                onMouseEnter={select}
                onFocus={select}
                onClick={select}
              >
                <span className="stack-entry__name">{skill.name}</span>
                <span className="stack-entry__category mono">{skill.cat} {isSelected ? "←" : ""}</span>
              </button>
            );
          })}
        </div>
        <SkillDossier skill={selectedSkill} />
      </div>
    </EditorialSection>
  );
}

function SkillDossier({ skill }) {
  return (
    <div className="dossier" aria-live="polite">
      <div className="dossier__meta mono">{skill.cat} · SINCE {skill.since}</div>
      <div className="dossier__name">{skill.name}</div>
      <p className="body-p dossier__note">{skill.note}</p>
      <div className="dossier__appears mono">APPEARS IN THIS ISSUE</div>
      {skill.projects.length ? (
        skill.projects.map((project) => (
          <div key={project} className="dossier__project">
            <span className="dossier__arrow">→</span><span className="dossier__project-name">{project}</span>
          </div>
        ))
      ) : (
        <div className="dossier__empty mono">OFF THE RECORD — COURSEWORK & SIDE BUILDS</div>
      )}
    </div>
  );
}
