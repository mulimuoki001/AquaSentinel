"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDatabaseAndTables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const ensureDatabaseAndTables = async () => {
    try {
        // Connect and ensure tables (not the DB)
        await db_1.db.connect();
        console.log("✅ Connected to PostgreSQL database");
        await db_1.db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Users table is ready");
    }
    catch (err) {
        console.error("❌ Error setting up database or tables:", err);
    }
};
exports.ensureDatabaseAndTables = ensureDatabaseAndTables;
