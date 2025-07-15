"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getUserData = exports.getUsers = void 0;
const db_1 = require("../config/db");
const getUsers = async (req, res) => {
    try {
        const users = await (await db_1.db).query(`SELECT * FROM users`);
        res.status(200).json(users.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting users" });
    }
};
exports.getUsers = getUsers;
const getUserData = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        console.log("userId:", userId);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized access" });
        }
        else {
            const user = await (await db_1.db).query(`SELECT * FROM users WHERE id = $1`, [
                userId,
            ]);
            if (user.rows.length === 0) {
                res.status(404).json({ message: "User not found" });
            }
            else {
                const userData = user.rows[0];
                // Remove sensitive data
                delete userData.password;
                // Set the user data on the req object
                // req.userData = userData;
                // next(); // Pass control to the next middleware function
                res.status(200).json(userData);
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting user data" });
    }
};
exports.getUserData = getUserData;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { name, email, farmphone, farmname, farmlocation } = req.body;
        const profilePic = req.file?.filename;
        const fields = [];
        const values = [];
        let index = 1;
        if (name) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }
        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }
        if (farmphone) {
            fields.push(`farmphone = $${index++}`);
            values.push(farmphone);
        }
        if (farmname) {
            fields.push(`farmname = $${index++}`);
            values.push(farmname);
        }
        if (farmlocation) {
            fields.push(`farmlocation = $${index++}`);
            values.push(farmlocation);
        }
        if (profilePic) {
            fields.push(`profile_pic = $${index++}`);
            values.push(profilePic);
        }
        // Always update timestamp
        fields.push(`last_updated = NOW()`);
        if (fields.length === 0) {
            res.status(400).json({ message: "No fields provided to update." });
        }
        else {
            const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index}`;
            values.push(userId);
            await (await db_1.db).query(query, values);
            res.status(200).json({ message: "Profile updated successfully." });
        }
    }
    catch (err) {
        console.error("Profile update failed:", err);
        res.status(500).json({ message: "Server error during profile update." });
    }
};
exports.updateProfile = updateProfile;
