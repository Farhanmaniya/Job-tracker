import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const appRouter = Router();

type jobFields = {
  company: string;
  role: string;
  status?: "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";
  appliedDate: Date;
  jobLink?: string;
  source?: string;
  location?: string;
  notes?: string;
  salaryInfo?: string;
};

type ApplicationResponse = {
  company: string;
  role: string;
  status?: "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";
  appliedDate: Date;
  jobLink?: string | null;
  source?: string | null;
  location?: string | null;
  notes?: string | null;
  salaryInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  id?: string;
};

appRouter.use(requireAuth);

// Create Job -> POST -> To create a new JOB
appRouter.post("/", async (req: Request<{}, {}, jobFields>, res) => {
  const {
    company,
    role,
    status,
    appliedDate,
    jobLink,
    source,
    location,
    notes,
    salaryInfo,
  } = req.body;

  if (!company || !role || !appliedDate) {
    res
      .status(400)
      .json({ message: "company, role and applied date are required" });
  }

  try {
    const application = await prisma.jobApplication.create({
      data: {
        company,
        role,
        status,
        appliedDate: new Date(appliedDate),
        jobLink,
        source,
        location,
        notes,
        salaryInfo,
        userId: req.userId,
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went Wrong" });
  }
});

// getAllJobs -> GET -> To get all the jobs with related to the that userId
appRouter.get(
  "/",
  async (
    req: Request,
    res: Response<{ message: string } | ApplicationResponse[]>,
  ) => {
    try {
      const applications: ApplicationResponse[] | null =
        await prisma.jobApplication.findMany({
          where: { userId: req.userId },
          orderBy: { appliedDate: "desc" },
        });

      if (!applications) {
        return res.status(404).json({ message: "No Job Applications Find" });
      }
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went Wrong" });
    }
  },
);

// get particular job with their ID -> GET -> Require Auth
appRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<ApplicationResponse | { message: string }>,
  ) => {
    const { id } = req.params;

    try {
      const application: ApplicationResponse | null =
        await prisma.jobApplication.findUnique({
          where: { id: id },
        });

      if (!application) {
        return res.status(404).json({ message: "JobApplication Not Found" });
      }

      if (application.userId !== req.userId) {
        return res
          .status(403)
          .json({ message: "You do not have access to this application" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

// to change partial part of any application -> PATCH
appRouter.patch(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<ApplicationResponse | { message: string }>,
  ) => {
    const { id } = req.params;
    const {
      company,
      role,
      status,
      appliedDate,
      jobLink,
      source,
      location,
      notes,
      salaryInfo,
    } = req.body;

    try {
      const existing = await prisma.jobApplication.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ message: "JobApplication Not Found" });
      }

      if (existing.userId !== req.userId) {
        return res
          .status(403)
          .json({ message: "You do not have access to this application" });
      }

      const updated = await prisma.jobApplication.update({
        where: { id },
        data: {
          company,
          role,
          status,
          appliedDate: appliedDate ? new appliedDate() : undefined,
          jobLink,
          source,
          location,
          notes,
          salaryInfo,
        },
      });

      res.status(200).json(updated);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

// DELETE Route to delete JOBApplication -> DELETE
appRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<{ message: string }>) => {
    const { id } = req.params;
    try {
      const existing = await prisma.jobApplication.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ message: "JobApplication Not Found" });
      }

      await prisma.jobApplication.delete({ where: { id } });

      res.status(200).json({ message: "JobApplication Deleted Successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);


export default appRouter;
