import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

export const createDbPool = (database: string) =>
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database,
  });

export const db = createDbPool(process.env.DB_NAME!);