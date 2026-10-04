import "dotenv/config";
import express, { application } from 'express'
import cors from 'cors'
import prisma from './lib/prisma'
import authRouter from "./routes/auth.routes";
import appRouter from "./routes/application.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/applications", appRouter);

app.get("/api/health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", database: "unreachable" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});