import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
  userData?: any;
}
export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("🔴 No Authorization header in request");
    return res.status(401).json({ message: "Unauthorized: No auth header" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    console.log("🔴 Bearer token format is invalid");
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: number;
      role: string;
    };
    console.log("✅ JWT decoded successfully", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔴 JWT verification failed:", err);
    res.status(401).json({ message: "Unauthorized: Token invalid or expired" });
  }
};

export default authenticateJWT;