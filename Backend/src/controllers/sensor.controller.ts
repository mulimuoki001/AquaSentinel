import { Request, Response, NextFunction, RequestHandler } from "express";
import { getRecentMoistureData, saveMoistureData } from "../models/moisture.model";
import { getRecentWaterFlowData, saveWaterFlowData, getTotalWaterUsed, getPumpRuntime, getWaterUsageBuckets } from "../models/waterFlow.model";
import { sensorData } from "../config/mqttClient";
import { db } from "../config/db";
import { DateTime } from "luxon";

let moistureDataLoop = false;
let waterFlowDataLoop = false;


//start the water flow data loop
async function startWaterFlowLoop() {
    let lastWaterFlow = 0;

    setInterval(() => {
        const raw: any = getRecentWaterFlowData();
        const latestWaterFlowRecord = sensorData ? JSON.parse(sensorData) : null;

        const current = latestWaterFlowRecord.waterFlow;
        const flowUnit = latestWaterFlowRecord.flowUnit || "L/min";
        const pumpStatus = latestWaterFlowRecord.pumpStatus || "OFF";
        // ✅ Convert timestamp to Africa/Kigali timezone
        const rawTimestamp = latestWaterFlowRecord.timeStamp || new Date().toISOString();
        const kigaliTime = DateTime
            .fromISO(rawTimestamp, { zone: "utc" })
            .setZone("Africa/Kigali")


        lastWaterFlow = current;
        if (!raw) {
            console.warn("📭 No MQTT data available yet.");
            return;
        }

        try {
            const data = {
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
    }, 5000); // every 5 seconds
}
// Start the moisture data loop
async function startMoistureLoop() {
    let lastMoisture = 0;

    setInterval(() => {
        const raw: any = getRecentMoistureData();
        const latestMoistureRecord = sensorData ? JSON.parse(sensorData) : null;

        const current = latestMoistureRecord.moisture;
        const change = latestMoistureRecord.moistureChange || 0;
        lastMoisture = current;
        if (!raw) {
            console.warn("📭 No MQTT data available yet.");
            return;
        }

        try {


            const data = {
                moisture: current,
                moistureChange: change,
                moistureUnit: latestMoistureRecord.moistureUnit || "%",
            };

            saveMoistureData(data);

        } catch (err: any) {
            console.error("❌ Error parsing MQTT data:", err.message);
        }
    }, 5000); // every 1 second
}


// ✅ GET /api/moisture
export const fetchRecentMoisture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!moistureDataLoop) {
            console.log("🔄 Fetching moisture data from MQTT loop");
            moistureDataLoop = true;
            startMoistureLoop();

        }
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
        if (!waterFlowDataLoop) {
            console.log("🔄 Fetching water flow data from MQTT loop");
            waterFlowDataLoop = true;
            startWaterFlowLoop();


        }
        if (sensorData) {
            const parsed = JSON.parse(sensorData);
            console.log("📊 Fetched water flow data from MQTT:", parsed);
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
        console.log("Calculating total water used from", start.toISOString(), "to", end.toISOString());

        const total = await getTotalWaterUsed(start, end);
        console.log("Total water used in last 1 hour:", total.toFixed(2), "liters");

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
        const start = new Date(end.getTime() - 60 * 60 * 1000); // Last 1 hour
        const runtimeInMinutes = await getPumpRuntime(start, end);
        // console.log("Pump runtime in minutes:", runtimeInMinutes.toFixed(0));
        res.json({ success: true, runtimeMinutes: runtimeInMinutes });
    } catch (error) {
        console.error("❌ Error fetching pump runtime:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getWaterUsageGraphData = async (req: Request, res: Response) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 60 * 1000); // Last 3 hour
        const buckets = await getWaterUsageBuckets(start, end, 60); // 10-minute intervals
        res.json({ success: true, data: buckets });
    } catch (error) {
        console.error("❌ Error fetching graph data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch usage graph data." });
    }
};


export const getAllWaterFlowData = async (req: Request, res: Response) => {
    try {
        const result = await (await db).query(`
      SELECT * FROM water_flow_sensor_data
      ORDER BY timestamp ASC
    `
        );
        console.log("📊 Fetched all water flow data:", result.rows, "records");
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("❌ Error fetching water flow data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


