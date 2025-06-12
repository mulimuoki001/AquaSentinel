"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const db_1 = require("../config/db");
const getUsers = async (req, res) => {
    try {
        const users = await db_1.db.query(`SELECT * FROM users`);
        res.status(200).json(users.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting users" });
    }
};
exports.getUsers = getUsers;
