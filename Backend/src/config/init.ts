import dotenv from 'dotenv';
import { Pool } from 'pg';
import { db } from './db';

dotenv.config();

const basePool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const ensureDatabaseAndTables = async () => {
  try {
    // Ensure DB exists
    const dbName = process.env.DB_NAME!;
    const dbCheck = await basePool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (dbCheck.rowCount === 0) {
      await basePool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created`);
    } else {
      console.log(`✅ Database '${dbName}' exists`);
    }

    // Connect to the DB and ensure tables
    await db.connect();
    console.log('✅ Connected to PostgreSQL database');

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

    console.log('✅ Users table is ready');
  } catch (err) {
    console.error('❌ Error setting up database or tables:', err);
  }
};
