import { Request, Response } from "express";
import { getLatestPumpSession } from "../config/pumpSession.getter";
import { fetchAllPumpSessions, getPumpSessionsByUserId, getTotalWaterUsedDaily } from "../models/pumpSessions.model";

export const getLivePumpSession = (req: Request, res: Response): void => {
    const session = getLatestPumpSession();
    try {
        if (!session) {
            res.status(404).json({ message: "Session not found" });
        } else {
            const clientSessionId = req.query.sessionId;

            if (clientSessionId && session?.id.toString() === clientSessionId.toString()) {
                res.status(200).json({ message: "This is the latest session" });
            } else {
                res.status(200).json({ session });
            }
        }
    } catch (error) {
        console.error("❌ Error fetching sessions:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getUserPumpSessions = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).json({ error: "Missing or invalid userId" });
    } else {
        try {
            const sessions = await getPumpSessionsByUserId(Number(userId));
            res.status(200).json({ sessions });
        } catch (error) {
            console.error("❌ Error fetching sessions:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};


export const getAllPumpSessions = async (req: Request, res: Response): Promise<void> => {
    try {
        const sessions = await fetchAllPumpSessions();
        res.status(200).json({ sessions });
    } catch (error) {
        console.error("❌ Failed to fetch sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTotalWaterUsedDailybyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const totalWaterUsed = await getTotalWaterUsedDaily(Number(userId)); // Pass userId as a number to the functionuserId);
        console.log("Total water used:", totalWaterUsed.map((item: any) => item.total_water_used));
        res.status(200).json({ totalWaterUsed });
    } catch (error) {
        console.error("❌ Failed to fetch total water used:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};