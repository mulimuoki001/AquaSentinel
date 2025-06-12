"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.logoutAll = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const user_model_1 = require("../models/user.model");
const tokenManager_1 = require("../utils/tokenManager");
const fs = require("fs");
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await (0, user_model_1.getUserByEmail)(email);
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.db.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`, [name, email, hashedPassword, role]);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};
exports.register = register;
// Return 409 Conflict if the user already exists
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await (0, user_model_1.getUserByEmail)(email);
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid email or password" });
        }
        //Token management
        const existingToken = await (0, tokenManager_1.getActiveToken)(user.id);
        console.log("Existing token:", existingToken);
        if (existingToken && !tokenBlacklist.has(existingToken)) {
            res.status(400).json({ message: "User already logged in" });
        }
        // Generate token
        const newToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });
        await (0, tokenManager_1.setActiveToken)(user.id, newToken);
        res.status(200).json({ newToken, role: user.role, userId: user.id });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
exports.login = login;
// Load token blacklist from file
let tokenBlacklist = new Set();
fs.readFile("tokenBlacklist.json", "utf8", (err, data) => {
    if (data === "") {
        console.log("Token blacklist is empty");
    }
    if (err) {
        console.error(err);
    }
    else {
        try {
            const blacklist = JSON.parse(data);
            tokenBlacklist = new Set(blacklist);
        }
        catch (error) {
            console.error(error);
        }
    }
});
// Logout endpoint
const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        res.status(400).json({ message: "Token missing" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        //Add token to blacklist
        tokenBlacklist.add(token);
        //Save token blacklist to file
        fs.writeFile("tokenBlacklist.json", JSON.stringify([...tokenBlacklist]), (err) => {
            if (err)
                console.error("❌ Error saving token blacklist:", err.message);
            else
                console.log("✅ Token added to blacklist and saved to file");
        });
        //Delete token from database
        await (0, tokenManager_1.removeActiveToken)(decoded.userId);
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
    }
};
exports.logout = logout;
//Logout all users
const logoutAll = async (req, res) => {
    try {
        const allActiveTokens = await (0, tokenManager_1.loadActiveTokens)();
        Object.values(allActiveTokens).forEach((token) => {
            tokenBlacklist.add(token);
        });
        fs.writeFile("tokenBlacklist.json", JSON.stringify([...tokenBlacklist]), (err) => {
            if (err)
                console.error("❌ Error saving token blacklist:", err.message);
            else
                console.log("✅ Token blacklist saved to file");
        });
        //Remove all active tokens from the json file
        await (0, tokenManager_1.removeActiveTokens)();
        res.status(200).json({ message: "Logged out all users successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out all users" });
    }
};
exports.logoutAll = logoutAll;
//Token validation
const validateToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ valid: false, error: "No token provided" });
        return;
    }
    const user = jsonwebtoken_1.default.decode(token);
    if (tokenBlacklist.has(token)) {
        res
            .status(401)
            .json({ valid: false, error: "Token blacklisted", role: user.role });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        res.status(200).json({ valid: true, role: user.role });
    }
    catch (err) {
        res.status(401).json({ valid: false, error: "Token expired or invalid" });
    }
};
exports.validateToken = validateToken;
