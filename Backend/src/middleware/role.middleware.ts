import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}
export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
