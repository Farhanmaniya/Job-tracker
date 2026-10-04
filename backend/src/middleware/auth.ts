import { Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request<{}, {}, {userId: string}>, res: Response<{message: string}>, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token Provided" })
    }

    if (!authHeader.startsWith(`Bearer `)) {
        return res.status(401).json({ message: 'Bearer token not attached perfectly'})
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string};
        req.userId = payload.userId
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}