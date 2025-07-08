import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let db: Pool;


// Running on Railway (cloud)
db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});




export { db };
