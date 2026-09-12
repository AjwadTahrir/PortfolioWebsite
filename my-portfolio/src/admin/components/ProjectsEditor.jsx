import { Fragment, useState } from "react";
import useProjectsData from "../../hooks/cms/useProjectsData";
import useCrud from "../useCrud";
import ProjectForm, { blankProject } from "./ProjectForm";

/* List of projects, each expandable into a full ProjectForm; a blank form
   at the bottom adds a new one. The list itself only shows the fields you
   need to find the right project — the form has everything else. */
export default function ProjectsEditor() {
  const { projects, loading } = useProjectsData();
  const { insert, update, remove, savingId, error } = useCrud("projects");
  const [openId, setOpenId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addProject = async (project) => {
    const ok = await insert(project);
    if (ok) setShowAddForm(false);
    return ok;
  };

  return (
    <div>
      {error && <p className="admin-error mono">{error}</p>}
      {loading && <p className="mono">LOADING…</p>}

      <table className="admin-table">
        <thead><tr><th>Order</th><th>ID</th><th>No.</th><th>Section</th><th>Name</th><th /></tr></thead>
        <tbody>
          {projects.map((project) => (
            <Fragment key={project.id}>
              <tr>
                <td className="mono">{project.sort_order}</td>
                <td className="mono">{project.id}</td>
                <td className="mono">{project.no}</td>
                <td className="mono">{project.importance}</td>
                <td>{project.name}</td>
                <td className="admin-row-actions">
                  <button className="admin-btn admin-btn--small" onClick={() => setOpenId(openId === project.id ? null : project.id)}>
                    {openId === project.id ? "CLOSE" : "EDIT"}
                  </button>
                  <button
                    className="admin-btn admin-btn--small admin-btn--danger"
                    disabled={savingId === project.id}
                    onClick={() => confirm(`Delete "${project.name}"? This cannot be undone.`) && remove(project.id)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
              {openId === project.id && (
                <tr>
                  <td colSpan={6}>
                    <ProjectForm
                      key={project.id}
                      initial={project}
                      submitLabel="SAVE CHANGES"
                      saving={savingId === project.id}
                      onSubmit={(patch) => update(project.id, patch)}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {showAddForm ? (
        <div className="admin-add-form">
          <div className="admin-add-form__title mono">NEW PROJECT</div>
          <ProjectForm
            initial={blankProject()}
            submitLabel="ADD PROJECT"
            saving={savingId === "new"}
            isNew
            onSubmit={addProject}
          />
        </div>
      ) : (
        <button className="admin-btn" onClick={() => setShowAddForm(true)}>+ ADD PROJECT</button>
      )}
    </div>
  );
}
