import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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
  const { name, email, password, role, farmname, farmlocation, farmphone } =
    req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    } else {
      if (role === "farmer") {
        if (!farmname || !farmlocation || !farmphone) {
          res.status(400).json({ message: "Farm information is required" });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await (await db).query(
        `INSERT INTO users (name, email, password, role, farmname, farmlocation, farmphone) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, email, hashedPassword, role, farmname, farmlocation, farmphone]
      );
      res.status(200).json({ message: `User registered successfully ${user}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    //Token management
    const existingToken = await getActiveToken(user.id);
    if (existingToken && !tokenBlacklist.has(existingToken)) {
      res.status(201).json({
        message: "User already logged in",
        newToken: existingToken,
        role: user.role,
        userId: user.id,
      });
    } else {
      // Generate token
      const newToken = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: 36000,
        }
      );
      const expirationTime = Date.now() + 60; // 60 seconds
      console.log("Expiration time:", expirationTime);
      await setActiveToken(user.id, newToken, expirationTime);

      res.status(200).json({
        message: "User logged in successfully",
        newToken,
        userId: user.id,
        role: user.role,
        expirationTime,
      });
    }
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
  if (!token) {
    res.status(400).json({ message: "Token missing" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      //Add token to blacklist
      tokenBlacklist.add(token!);
      //Save token blacklist to file
      await fs.writeFile(
        "tokenBlacklist.json",
        JSON.stringify([...tokenBlacklist]),
        (err: NodeJS.ErrnoException | null) => {
          if (err)
            console.error("❌ Error saving token blacklist:", err.message);
          else console.log("✅ Token added to blacklist and saved to file");
        }
      );
      //Delete token from database
      await removeActiveToken(token);
      console.log("Token removed from database");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging out" });
    }
  }
};

//Logout all users
export const logoutAll: RequestHandler = async (req, res) => {
  try {
    const allActiveTokens = await loadActiveTokens();
    Object.values(allActiveTokens).forEach((tokenObject) => {
      tokenBlacklist.add(tokenObject.token);
    });

    fs.writeFile(
      "tokenBlacklist.json",
      JSON.stringify([...tokenBlacklist]),
      (err: NodeJS.ErrnoException | null) => {
        if (err)
          console.error("❌ Error saving token blacklist:", err.message);
        else console.log("✅ Token added to blacklist and saved to file");
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
const logoutUser = async (token: string) => {
  try {
    // Add token to blacklist
    tokenBlacklist.add(token);
    // Save token blacklist to file
    fs.writeFile(
      "tokenBlacklist.json",
      JSON.stringify([...tokenBlacklist]),
      (err: NodeJS.ErrnoException | null) => {
        if (err)
          console.error("❌ Error saving token blacklist:", err.message);
        else console.log("✅ Token added to blacklist and saved to file");
      }
    );
    // Delete token from database
    await removeActiveToken(token);
    console.log("Token removed from database");
  } catch (error) {
    console.error(error);
  }
}
//Token validation
export const validateToken: RequestHandler = async (req, res) => {
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
  } else {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as JwtPayload;
      const expirationDate = decodedToken.exp ? decodedToken.exp : null;
      console.log("expirationDate", expirationDate);

      // Check if token is about to expire
      if (expirationDate) {
        const logoutTime = new Date(expirationDate);
        const currentTime = Date.now();
        const dateDifference = logoutTime.getTime() - currentTime;
        console.log("dateDifference", dateDifference);
        if (dateDifference <= 20000) {
          console.log("Token is about to expire");
          res
            .status(401)
            .json({ valid: false, error: "Token is about to expire" });
          await logoutUser(token);
          return;
        }
      }

      // Token is valid and not about to expire, send response
      res.status(200).json({ valid: true, role: user.role });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          valid: false,
          error: "Token is expired",
        });
      } else {
        res.status(500).json({
          valid: false,
          error: "Token is invalid",
        });
      }
    }
  }
};
