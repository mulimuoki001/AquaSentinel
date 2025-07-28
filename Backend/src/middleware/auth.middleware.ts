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

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        userId: number;
        role: string;
      };

      req.user = decoded;
      return next();
    } catch (err) {

      res.status(401).json({ message: "Unauthorized Access to this route, error verifying token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized Access to this route, no header found" });
  }
};
