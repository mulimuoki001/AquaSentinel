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
    await (await db).query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS profile_pic TEXT,
      ADD COLUMN IF NOT EXISTS name TEXT,
      ADD COLUMN IF NOT EXISTS email TEXT,
      ADD COLUMN IF NOT EXISTS farmphone TEXT,
      ADD COLUMN IF NOT EXISTS farmname TEXT,
      ADD COLUMN IF NOT EXISTS farmlocation TEXT,
      ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ DEFAULT NOW();
    `);

    await (await db).query(`
      CREATE TABLE IF NOT EXISTS moisture_data1 (
        id SERIAL PRIMARY KEY,
        moisture INT NOT NULL,
        moisture_unit TEXT DEFAULT '%',
        moisture_change INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await (await db).query(`
      CREATE TABLE IF NOT EXISTS water_flow_sensor_data (
        id SERIAL PRIMARY KEY,
        userId INT NOT NULL,
        flowRate FLOAT NOT NULL,
        flowUnit TEXT DEFAULT 'L/min',
        pumpStatus TEXT DEFAULT 'OFF',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date DATE DEFAULT CURRENT_DATE,
        time TEXT
      );
    `);

    await (await db).query(`
      CREATE TABLE IF NOT EXISTS pump_sessions (
        id SERIAL PRIMARY KEY,
        user_id INT,
        date DATE DEFAULT CURRENT_DATE,
        start_time TEXT NOT NULL,
        end_time TEXT,
        duration FLOAT,        
        total_liters FLOAT,
        status VARCHAR(50)
      );
      
    `);
    console.log("✅ Users table is ready");
  } catch (err) {
    console.error("❌ Error setting up database or tables:", err);
  }
};





