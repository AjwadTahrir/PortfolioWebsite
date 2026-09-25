import { useState } from "react";
import { SKILLS } from "../../data/skills";
import { sentenceCase } from "../../utils/format";
import EditorialSection from "../layout/EditorialSection";
import "./StackIndexSection.css";

/* Index of technologies; hovering, focusing or clicking an entry shows its dossier. */
export default function StackIndexSection() {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS[0]);

  return (
    <EditorialSection id="index" title="The stack index" deck="Point at a tool to see where it appears." className="stack-index">
      <div className="stack-index__grid">
        <div className="stack-index__list">
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
                <span className="stack-entry__category">{sentenceCase(skill.cat)}</span>
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
      <div key={skill.name} className="dossier__inner">
        <div className="dossier__meta">{sentenceCase(skill.cat)}, since {skill.since}</div>
        <div className="dossier__name">{skill.name}</div>
        <p className="body-p dossier__note">{skill.note}</p>
        <div className="dossier__appears">Appears in this issue</div>
        {skill.projects.length ? (
          skill.projects.map((project) => (
            <div key={project} className="dossier__project">{project}</div>
          ))
        ) : (
          <div className="dossier__empty">Off the record: coursework and side builds.</div>
        )}
      </div>
    </div>
  );
}
