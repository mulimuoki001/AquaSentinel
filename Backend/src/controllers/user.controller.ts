import { NextFunction, Response } from "express";
import { db } from "../config/db";
import { AuthenticatedRequest } from "../types/types";

type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response
) => Promise<void>;
export const getUsers: AuthenticatedRequestHandler = async (req, res) => {
  try {
    const users = await (await db).query(`SELECT * FROM users`);
    res.status(200).json(users.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting users" });
  }
};

export const getUserData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    console.log("userId:", userId);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const user = await (await db).query(`SELECT * FROM users WHERE id = $1`, [
        userId,
      ]);
      if (user.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        const userData = user.rows[0];
        // Remove sensitive data
        delete userData.password;
        // Set the user data on the req object
        req.userData = userData;
        next(); // Pass control to the next middleware function
        res.status(200).json(userData);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting user data" });
  }
};
