"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoneNumberByUserId = exports.getUserByEmail = exports.User = void 0;
const db_1 = require("../config/db");
const User = async (name, email, password, role, farmname, farmlocation, farmphone) => {
    const result = await (await db_1.db).query(`INSERT INTO users (name, email, password, role, farmname, farmlocation, farmphone) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [name, email, password, role, farmname, farmlocation, farmphone]);
    return result.rows[0];
};
exports.User = User;
const getUserByEmail = async (email) => {
    const result = await (await db_1.db).query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0];
};
exports.getUserByEmail = getUserByEmail;
const getPhoneNumberByUserId = async (userId) => {
    try {
        const result = await (await db_1.db).query("SELECT farmphone FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    }
    catch (error) {
        console.error("❌ Error fetching phone number:", error);
        throw error;
    }
};
exports.getPhoneNumberByUserId = getPhoneNumberByUserId;
