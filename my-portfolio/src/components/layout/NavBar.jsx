import { FOLIO } from "../../constants/site";
import { NAV_ITEMS, SECTION_IDS } from "../../data/navigation";
import useActiveSection from "../../hooks/useActiveSection";
import "./NavBar.css";

/* Sticky running header; highlights the section being read. */
export default function NavBar() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <nav className="navbar" aria-label="Sections">
      <div className="wrap navbar__inner">
        <span className="navbar__brand mono">{FOLIO}</span>
        <div className="navbar__links">
          {NAV_ITEMS.map(({ id, label, no }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`navbar__link${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="navbar__no">{no}</span> <span className="navbar__label">{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
