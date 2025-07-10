import { NextFunction, Response, Request } from "express";
import { db } from "../config/db";
import { AuthenticatedRequest } from "../types/types";


type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
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
      res.status(401).json({ message: "Unauthorized access" });
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
        // req.userData = userData;
        // next(); // Pass control to the next middleware function
        res.status(200).json(userData);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting user data" });
  }
};




export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, email, farmphone, farmname, farmlocation } = req.body;
    const profilePic = req.file?.filename;

    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (farmphone) {
      fields.push(`farmphone = $${index++}`);
      values.push(farmphone);
    }
    if (farmname) {
      fields.push(`farmname = $${index++}`);
      values.push(farmname);
    }
    if (farmlocation) {
      fields.push(`farmlocation = $${index++}`);
      values.push(farmlocation);
    }
    if (profilePic) {
      fields.push(`profile_pic = $${index++}`);
      values.push(profilePic);
    }

    // Always update timestamp
    fields.push(`last_updated = NOW()`);

    if (fields.length === 0) {
      res.status(400).json({ message: "No fields provided to update." });
    } else {
      const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index}`;
      values.push(userId);

      await (await db).query(query, values);

      res.status(200).json({ message: "Profile updated successfully." });
    }

  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Server error during profile update." });
  }
};


