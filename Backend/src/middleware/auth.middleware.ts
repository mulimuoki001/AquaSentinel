import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        userId: number;
        role: string;
      };

      req.user = decoded;
      return next();
    } catch (err) {
      console.error("Error verifying token:", err);
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    console.log("No authorization header found");
    res.status(401).json({ message: "Unauthorized" });
  }
};
