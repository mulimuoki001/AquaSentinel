import { Request, Response } from "express";
import { getLatestPumpSession } from "../config/pumpSession.getter";

export const getLivePumpSession = (req: Request, res: Response): void => {
    const session = getLatestPumpSession();

    if (!session) {
        res.status(404).json({ message: "No recent pump session" });
    } else {
        const clientSessionId = req.query.sessionId;

        if (clientSessionId && session?.id.toString() === clientSessionId.toString()) {
            res.status(200).json({ message: "This is the latest session" });
        } else {
            res.status(200).json({ session });
        }
    }
};
