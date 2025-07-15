"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalWaterUsedDailybyUser = exports.getAllPumpSessions = exports.getUserPumpSessions = exports.getLivePumpSession = void 0;
const pumpSession_getter_1 = require("../config/pumpSession.getter");
const pumpSessions_model_1 = require("../models/pumpSessions.model");
const getLivePumpSession = (req, res) => {
    const session = (0, pumpSession_getter_1.getLatestPumpSession)();
    try {
        if (!session) {
            res.status(404).json({ message: "Session not found" });
        }
        else {
            const clientSessionId = req.query.sessionId;
            if (clientSessionId && session?.id.toString() === clientSessionId.toString()) {
                res.status(200).json({ message: "This is the latest session" });
            }
            else {
                res.status(200).json({ session });
            }
        }
    }
    catch (error) {
        console.error("❌ Error fetching sessions:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getLivePumpSession = getLivePumpSession;
const getUserPumpSessions = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).json({ error: "Missing or invalid userId" });
    }
    else {
        try {
            const sessions = await (0, pumpSessions_model_1.getPumpSessionsByUserId)(Number(userId));
            res.status(200).json({ sessions });
        }
        catch (error) {
            console.error("❌ Error fetching sessions:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};
exports.getUserPumpSessions = getUserPumpSessions;
const getAllPumpSessions = async (req, res) => {
    try {
        const sessions = await (0, pumpSessions_model_1.fetchAllPumpSessions)();
        res.status(200).json({ sessions });
    }
    catch (error) {
        console.error("❌ Failed to fetch sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllPumpSessions = getAllPumpSessions;
const getTotalWaterUsedDailybyUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const totalWaterUsed = await (0, pumpSessions_model_1.getTotalWaterUsedDaily)(Number(userId)); // Pass userId as a number to the functionuserId);
        console.log("Total water used:", totalWaterUsed.map((item) => item.total_water_used));
        res.status(200).json({ totalWaterUsed });
    }
    catch (error) {
        console.error("❌ Failed to fetch total water used:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTotalWaterUsedDailybyUser = getTotalWaterUsedDailybyUser;
