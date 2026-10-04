import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JobApplication } from "../types/application";
import { getApplications, deleteApplications, updateApplication } from "../api/applications";
import ApplicationForm from "../components/ApplicationForm";
import "./Dashboard.css";

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  OA: "OA",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function formDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Dashboard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleDelete(id: string) {
    try {
      await deleteApplications(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      setError("Could not delete application");
    }
  }

  function startEdit(app: JobApplication) {
    setEditingId(app.id);
    setEditStatus(app.status);
  }

  async function saveEdit(id: string) {
    try {
      const updated = await updateApplication(id, { status: editStatus });
      setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
      setEditingId(null);
    } catch {
      setError("Could not update application");
    }
  }

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("Could not load applications"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const statusCounts = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Job Tracker</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {applications.length > 0 && (
        <div className="status-summary">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status}>
              <span className="status-dot" style={{ background: `var(--status-${status.toLowerCase()})`}} />
              {count} {STATUS_LABELS[status]}
            </span>
          ))}
        </div>
      )}

      <ApplicationForm onCreated={(newApp) => setApplications((prev) => [newApp, ...prev])} />
      {applications.length === 0 ? (
        <p className="empty-state">No applications yet. Add your first one above.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="company-cell">{app.company}</td>
                <td className="role-cell">{app.role}</td>
                <td className="status-cell">
                  {editingId === app.id ? (
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <span className="status-dot" style={{ background: `var(--status-${app.status.toLowerCase()})` }} />
                      {STATUS_LABELS[app.status]}
                    </>
                  )}
                </td>
                <td className="date-cell">{formDate(app.appliedDate)}</td>
                <td>
                  {editingId === app.id ? (
                    <div className="row-actions">
                      <button onClick={() => saveEdit(app.id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="row-actions">
                      <button onClick={() => startEdit(app)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(app.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
