import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth";

const authRouter: Router = Router();

type UserForRequest = {
  name?: string;
  email: string;
  password: string;
};

type User = {
  name: string;
  email: string;
  id: string;
};

// SignUp Route -> To Register New User
authRouter.post(
  "/signup",
  async (
    req: Request<{}, {}, UserForRequest>,
    res: Response<{ message: string } | User>,
  ) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required" });
    }

    try {
      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existing) {
        return res.status(409).json({ message: "Email already Registered." });
      }

      const passwordHash: string = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email: email.toLowerCase(), passwordHash },
      });

      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      console.error(error);
      res.status(5000).json({ message: "Something Went Wrong" });
    }
  },
);

// Login Route -> to Login Old User
authRouter.post(
  "/login",
  async (
    req: Request<{}, {}, UserForRequest>,
    res: Response<{ message: string } | { token: string; user: User }>,
  ) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatches: boolean = await bcrypt.compare(
        password,
        user.passwordHash,
      );

      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "2d" },
      );

      res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

authRouter.get("/me", requireAuth, (req, res) => {
    res.json({ userId: req.userId });
});

export default authRouter;
