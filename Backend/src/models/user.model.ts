import { db } from "../config/db";

export const User = async (
  name: string,
  email: string,
  password: string,
  role: string,
  farmname: string,
  farmlocation: string,
  farmphone: string
) => {
  const result = await (await db).query(
    `INSERT INTO users (name, email, password, role, farmname, farmlocation, farmphone) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, email, password, role, farmname, farmlocation, farmphone]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await (await db).query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

export const getPhoneNumberByUserId = async (userId: number): Promise<{ farmphone: string }> => {
  try {
    const result = await (await db).query(
      "SELECT farmphone FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error fetching phone number:", error);
    throw error;
  }
};