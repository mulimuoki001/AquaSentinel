import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const createDbPool = async (database: string) => {
  const defaultPool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "aquasentineldb",
  });



  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database,
  });

  return pool;
};

export const db = createDbPool(process.env.DB_NAME!);