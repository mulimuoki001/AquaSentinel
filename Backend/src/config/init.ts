import dotenv from "dotenv";
import { db } from "./db";

dotenv.config();
export const ensureDatabaseAndTables = async () => {
  try {
    // Connect and ensure tables (not the DB)
    await (await db).connect();
    console.log("✅ Connected to PostgreSQL database");

    await (await db).query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        farmname VARCHAR(100),
        farmlocation VARCHAR(100),
        farmphone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //Add new columns to users table if they don't exist
    await (await db).query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS farmname VARCHAR(100),
      ADD COLUMN IF NOT EXISTS farmlocation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS farmphone VARCHAR(20);
    `);

    console.log("✅ Users table is ready");
  } catch (err) {
    console.error("❌ Error setting up database or tables:", err);
  }
};
