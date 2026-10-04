import api from "./client";
import type { JobApplication } from "../types/application";

export async function createApplication(
    data: {
    company: string
    role: string
    status?: string
    appliedDate: string
    jobLink?: string
    source?: string
    location?: string
    notes?: string
    salaryInfo?: string
}): Promise<JobApplication> {
    const res = await api.post("/applications", data);
    return res.data;
}

export async function getApplications(): Promise<JobApplication[]> {
    const res = await api.get("/applications");
    return res.data;
}

export async function deleteApplications(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
}

export async function updateApplication(
  id: string,
  data: Partial<{
    company: string;
    role: string;
    status: string;
    appliedDate: string;
    jobLink: string;
    source: string;
    location: string;
    notes: string;
    salaryInfo: string;
  }>
): Promise<JobApplication> {
  const res = await api.patch(`/applications/${id}`, data);
  return res.data;
}