import { Request, Response, NextFunction, RequestHandler } from "express";
import { getRecentMoistureData, saveMoistureData } from "../models/moisture.model";
import { getRecentWaterFlowData, saveWaterFlowData, getTotalWaterUsed, getPumpRuntime, getFlowRateBuckets, getWaterUsageTodayBuckets, getAllWaterFlowDataPerUser } from "../models/waterFlow.model";
import { sensorData } from "../config/mqttClient";
import { db } from "../config/db";
import { DateTime } from "luxon";


//start the water flow data loop
export async function startWaterFlowLoop() {
    let lastWaterFlow = 0;
    console.log("Starting water flow data loop");

    setInterval(() => {
        const raw: any = getRecentWaterFlowData();
        const latestWaterFlowRecord = sensorData ? JSON.parse(sensorData) : null;
        if (!raw || !latestWaterFlowRecord) {
            console.warn("📭 No MQTT data available yet.");
            return;
        } else {
            try {
                const userId = latestWaterFlowRecord.userId;
                const current = latestWaterFlowRecord.waterFlow;
                const flowUnit = latestWaterFlowRecord.flowUnit || "L/min";
                const pumpStatus = latestWaterFlowRecord.pumpStatus || "OFF";
                // ✅ Convert timestamp to Africa/Kigali timezone
                const rawTimestamp = latestWaterFlowRecord.timeStamp || new Date().toISOString();
                const kigaliTime = DateTime
                    .fromISO(rawTimestamp, { zone: "utc" })
                    .setZone("Africa/Kigali")


                lastWaterFlow = current;
                const data = {
                    userId,
                    flowRate: current,
                    flowUnit,
                    pumpStatus,
                    timestamp: rawTimestamp, // e.g., "2025-07-03T12:34:56.789Z"
                    date: kigaliTime.toFormat("yyyy-MM-dd"),   // e.g., "2025-07-03"
                    time: kigaliTime.toFormat("HH:mm:ss"),
                };

                saveWaterFlowData(data);

            } catch (err: any) {
                console.error("❌ Error parsing MQTT data:", err.message);
            }
        }


    }, 5000); // every 5 seconds
}
// Start the moisture data loop
export async function startMoistureLoop() {
    let lastMoisture = 0;
    console.log("Starting moisture data loop");

    setInterval(() => {
        const raw: any = getRecentMoistureData();
        const latestMoistureRecord = sensorData ? JSON.parse(sensorData) : null;
        if (!raw || !latestMoistureRecord) {
            console.warn("📭 No MQTT data available yet.");
            return;
        } else {
            try {
                const current = latestMoistureRecord.moisture || 0;
                const change = latestMoistureRecord.moistureChange || 0;
                lastMoisture = current;

                const data = {
                    moisture: current,
                    moistureChange: change,
                    moistureUnit: latestMoistureRecord.moistureUnit || "%",
                };

                saveMoistureData(data);

            } catch (err: any) {
                console.error("❌ Error parsing MQTT data:", err.message);
            }
        }

    }, 5000); // every 1 second
}


// ✅ GET /api/moisture
export const fetchRecentMoisture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (sensorData) {
            const parsed = JSON.parse(sensorData);
            res.json({ success: true, source: "MQTT", data: [parsed] });
        } else {
            const data = await getRecentMoistureData(20);
            res.json({ success: true, source: "DB", data });

        }

    } catch (error) {
        console.error("❌ Failed to fetch moisture data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}




export const fetchRecentWaterFlow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (sensorData) {
            const parsed = JSON.parse(sensorData);

            res.json({ success: true, source: "MQTT", data: [parsed] });
        } else {
            const data = await getRecentWaterFlowData(20);
            if (data) {
                res.json({ success: true, source: "DB", data });
            }
        }


    } catch (error) {
        console.error("❌ Failed to fetch water flow data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// sensor.controller.ts
export const getWaterUsedLast1hr = async (req: Request, res: Response) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 60 * 60 * 1000); // 1 hour ago
        const total = await getTotalWaterUsed(start, end);
        res.json({ success: true, totalWaterUsed: total.toFixed(2) });
    } catch (error) {
        console.error("❌ Error calculating total water used:", error);
        res.status(500).json({ success: false, message: "Error calculating total water used" });
    }
};


// sensor.controller.ts
export const getPumpRuntimeHandler = async (req: Request, res: Response) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 6 * 60 * 60 * 1000); // Last 6 hous
        const runtimeInMinutes = await getPumpRuntime(start, end);
        // console.log("Pump runtime in minutes:", runtimeInMinutes.toFixed(0));
        res.json({ success: true, runtimeMinutes: runtimeInMinutes });
    } catch (error) {
        console.error("❌ Error fetching pump runtime:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getFlowRateGraphData = async (req: Request, res: Response) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 60 * 60 * 1000); // 1 hour ago
        console.log("Time Range:", start.toISOString(), "to", end.toISOString());
        const buckets = await getFlowRateBuckets(start, end, 1); // 1 minute buckets
        res.json({ success: true, data: buckets });
    } catch (error) {
        console.error("❌ Error fetching graph data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch usage graph data." });
    }
};


export async function fetchAllWaterFlowDataPerUser(req: Request, res: Response,): Promise<void> {
    try {

        const userId = Number(req.params.userId);
        const data = await getAllWaterFlowDataPerUser(userId);
        console.log("Water flow data for user", userId, ":", data);
        res.json({ success: true, data });

    } catch (error) {
        console.error("❌ Error fetching water flow data:", error);
        throw error;
    }
}

export const getAllWaterFlowData = async (req: Request, res: Response) => {
    try {
        const result = await (await db).query(`
      SELECT 
      id, flowRate, flowUnit, pumpStatus, timestamp, TO_CHAR(date, 'YYYY-MM-DD') AS date, time FROM water_flow_sensor_data
      ORDER BY timestamp ASC
    `
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("❌ Error fetching water flow data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getWaterUsageTodayHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const buckets = await getWaterUsageTodayBuckets(userId);
        res.json({ success: true, data: buckets });
    } catch (error) {
        console.error("❌ Error fetching today's water usage:", error);
        res.status(500).json({ success: false, message: "Failed to fetch water usage for today" });
    }
};
