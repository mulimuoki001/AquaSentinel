"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
            req.user = decoded;
            return next();
        }
        catch (err) {
            console.error("Error verifying token:", err);
            res.status(401).json({ message: "Unauthorized Access to this route, error verifying token" });
        }
    }
    else {
        console.log("No authorization header found");
        res.status(401).json({ message: "Unauthorized Access to this route, no header found" });
    }
};
exports.authenticateJWT = authenticateJWT;
