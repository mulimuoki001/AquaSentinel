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
    const { name, email, password, role, farmname, farmlocation, farmphone } = req.body;
    try {
        const existingUser = await (0, user_model_1.getUserByEmail)(email);
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
        }
        if (role === "farmer") {
            if (!farmname || !farmlocation || !farmphone) {
                res.status(400).json({ message: "Farm information is required" });
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await (await db_1.db).query(`INSERT INTO users (name, email, password, role, farmname, farmlocation, farmphone) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [name, email, hashedPassword, role, farmname, farmlocation, farmphone]);
        res.status(201).json({ message: `User registered successfully ${user}` });
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
        if (existingToken && !tokenBlacklist.has(existingToken)) {
            res.status(201).json({
                message: "User already logged in",
                newToken: existingToken,
                role: user.role,
                userId: user.id,
            });
        }
        else {
            // Generate token
            const newToken = jsonwebtoken_1.default.sign({
                userId: user.id,
                role: user.role,
            }, process.env.JWT_SECRET || "secret", {
                expiresIn: 36000,
            });
            const expirationTime = Date.now() + 60; // 60 seconds
            console.log("Expiration time:", expirationTime);
            await (0, tokenManager_1.setActiveToken)(user.id, newToken, expirationTime);
            res.status(200).json({
                message: "User logged in successfully",
                newToken,
                userId: user.id,
                role: user.role,
                expirationTime,
            });
        }
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
    if (!token) {
        res.status(400).json({ message: "Token missing" });
    }
    else {
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
            await (0, tokenManager_1.removeActiveToken)(token);
            console.log("Token removed from database");
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error logging out" });
        }
    }
};
exports.logout = logout;
//Logout all users
const logoutAll = async (req, res) => {
    try {
        const allActiveTokens = await (0, tokenManager_1.loadActiveTokens)();
        Object.values(allActiveTokens).forEach((tokenObject) => {
            tokenBlacklist.add(tokenObject.token);
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
const logoutUser = async (token) => {
    try {
        // Add token to blacklist
        tokenBlacklist.add(token);
        // Save token blacklist to file
        fs.writeFile("tokenBlacklist.json", JSON.stringify([...tokenBlacklist]), (err) => {
            if (err)
                console.error("Error saving token blacklist:", err.message);
            else
                console.log("Token added to blacklist and saved to file");
        });
        // Delete token from database
        await (0, tokenManager_1.removeActiveToken)(token);
        console.log("Token removed from database");
    }
    catch (error) {
        console.error(error);
    }
};
//Token validation
const validateToken = async (req, res) => {
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
    else {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
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
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({
                    valid: false,
                    error: "Token is expired",
                });
            }
            else {
                res.status(500).json({
                    valid: false,
                    error: "Token is invalid",
                });
            }
        }
    }
};
exports.validateToken = validateToken;
