import dotenv from "dotenv";
import { db } from "./db";

dotenv.config();

export const ensureDatabaseAndTables = async () => {
  try {
    // Connect and ensure tables (not the DB)
    await db.connect();
    console.log("✅ Connected to PostgreSQL database");

    await db.query(`
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
  } catch (err) {
    console.error("❌ Error setting up database or tables:", err);
  }
};
