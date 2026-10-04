import { useState } from "react";
import { createApplication } from "../api/applications";
import type { JobApplication } from "../types/application";
import './ApplicationForm.css';

function ApplicationForm({
  onCreated,
}: {
  onCreated: (app: JobApplication) => void;
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const newApp = await createApplication({ company, role, appliedDate });
      onCreated(newApp);
      setCompany("");
      setRole("");
      setAppliedDate("");
    } catch {
      setError("Could not create applications");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="app-form">
      <label>
        Company
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </label>

      <label>
        Role
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </label>

      <label>
        Applied date
        <input
          type="data"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit">Add application</button>
    </form>
  );
}

export default ApplicationForm;
