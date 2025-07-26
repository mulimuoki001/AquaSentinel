import { Request, Response } from "express";
import { db } from "../config/db";

export async function getUserSensorData(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid or missing userId" });
    }

    try {
        const [waterFlowResult, moistureResult] = await Promise.all([
            (await db).query(
                `SELECT date, time, flowrate, pumpStatus FROM water_flow_sensor_data WHERE user_id = $1 ORDER BY date DESC, time DESC LIMIT 50`,
                [userId]
            ),
            (await db).query(
                `SELECT date, time, moisture FROM soil_moisture_sensor_data WHERE user_id = $1 ORDER BY date DESC, time DESC LIMIT 100`,
                [userId]
            ),
        ]);

        return res.json({
            userId,
            waterFlowData: waterFlowResult.rows,
            moistureData: moistureResult.rows,
        });
    } catch (error) {
        console.error("Error fetching sensor data:", error);
        res.status(500).json({ error: "Failed to fetch sensor data" });
    }
}
