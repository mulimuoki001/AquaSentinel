import { Request } from "express";
interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string; iat: number; exp: number };
  userData?: any;
  file?: any;
}

export { AuthenticatedRequest };
