export type Status = "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: Status;
  appliedDate: string;
  jobLink: string | null;
  source: string | null;
  location: string | null;
  notes: string | null;
  salaryInfo: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}