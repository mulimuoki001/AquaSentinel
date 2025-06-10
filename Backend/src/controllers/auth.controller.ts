import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { getUserByEmail } from "../models/user.model";
import {
  getActiveToken,
  loadActiveTokens,
  removeActiveToken,
  removeActiveTokens,
  setActiveToken,
} from "../utils/tokenManager";
const fs = require("fs");

export const register: RequestHandler = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};
// Return 409 Conflict if the user already exists

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    //Token management
    const existingToken = await getActiveToken(user.id);
    console.log("Existing token:", existingToken);
    if (existingToken && !tokenBlacklist.has(existingToken)) {
      res.status(400).json({ message: "User already logged in" });
    }
    // Generate token
    const newToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    await setActiveToken(user.id, newToken);

    res.status(200).json({ newToken, role: user.role, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Load token blacklist from file
let tokenBlacklist = new Set<string>();
fs.readFile("tokenBlacklist.json", "utf8", (err: Error, data: string) => {
  if (data === "") {
    console.log("Token blacklist is empty");
  }
  if (err) {
    console.error(err);
  } else {
    try {
      const blacklist = JSON.parse(data);
      tokenBlacklist = new Set(blacklist);
    } catch (error) {
      console.error(error);
    }
  }
});

// Logout endpoint
export const logout: RequestHandler = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) res.status(400).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(
      token!,
      process.env.JWT_SECRET || "secret"
    ) as any;
    //Add token to blacklist
    tokenBlacklist.add(token!);
    //Save token blacklist to file
    fs.writeFile(
      "tokenBlacklist.json",
      JSON.stringify([...tokenBlacklist]),
      (err: NodeJS.ErrnoException | null) => {
        if (err) console.error("❌ Error saving token blacklist:", err.message);
        else console.log("✅ Token added to blacklist and saved to file");
      }
    );
    //Delete token from database
    await removeActiveToken(decoded.userId);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out" });
  }
};

//Logout all users
export const logoutAll: RequestHandler = async (req, res) => {
  try {
    const allActiveTokens = await loadActiveTokens();
    Object.values(allActiveTokens).forEach((token: string) => {
      tokenBlacklist.add(token);
    });

    fs.writeFile(
      "tokenBlacklist.json",
      JSON.stringify([...tokenBlacklist]),
      (err: NodeJS.ErrnoException | null) => {
        if (err) console.error("❌ Error saving token blacklist:", err.message);
        else console.log("✅ Token blacklist saved to file");
      }
    );
    //Remove all active tokens from the json file
    await removeActiveTokens();
    res.status(200).json({ message: "Logged out all users successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out all users" });
  }
};

//Token validation
export const validateToken: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ valid: false, error: "No token provided" });
    return;
  }

  const user = jwt.decode(token) as any;

  if (tokenBlacklist.has(token)) {
    res
      .status(401)
      .json({ valid: false, error: "Token blacklisted", role: user.role });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.status(200).json({ valid: true, role: user.role });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Token expired or invalid" });
  }
};
