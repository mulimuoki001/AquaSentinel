"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.User = void 0;
const db_1 = require("../config/db");
const User = async (name, email, password, role) => {
    const result = await db_1.db.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`, [name, email, password, role]);
    return result.rows[0];
};
exports.User = User;
const getUserByEmail = async (email) => {
    const result = await db_1.db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};
exports.getUserByEmail = getUserByEmail;
