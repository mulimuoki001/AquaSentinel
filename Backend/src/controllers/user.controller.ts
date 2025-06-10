import { Request, RequestHandler } from "express";
import { db } from "../config/db";
interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string; iat: number; exp: number };
}
export const getUsers: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  try {
    const users = await db.query(`SELECT * FROM users`);
    res.status(200).json(users.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting users" });
  }
};
