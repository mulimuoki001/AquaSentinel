import { db } from "../config/db";

export const User = async (name: string, email: string, password: string, role: string) => { const result = await db.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`, [name, email, password, role]);
    return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};