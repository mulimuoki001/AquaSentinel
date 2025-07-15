"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaterUsageTodayHandler = exports.getAllWaterFlowData = exports.getFlowRateGraphData = exports.getPumpRuntimeHandler = exports.getWaterUsedLast1hr = exports.fetchRecentWaterFlow = exports.fetchRecentMoisture = void 0;
exports.startWaterFlowLoop = startWaterFlowLoop;
exports.startMoistureLoop = startMoistureLoop;
exports.fetchAllWaterFlowDataPerUser = fetchAllWaterFlowDataPerUser;
const moisture_model_1 = require("../models/moisture.model");
const waterFlow_model_1 = require("../models/waterFlow.model");
const mqttClient_1 = require("../config/mqttClient");
const db_1 = require("../config/db");
const luxon_1 = require("luxon");
//start the water flow data loop
async function startWaterFlowLoop() {
    let lastWaterFlow = 0;
    console.log("Starting water flow data loop");
    setInterval(() => {
        const raw = (0, waterFlow_model_1.getRecentWaterFlowData)();
        const latestWaterFlowRecord = mqttClient_1.sensorData ? JSON.parse(mqttClient_1.sensorData) : null;
        if (!raw || !latestWaterFlowRecord) {
            console.warn("📭 No MQTT data available yet.");
            return;
        }
        else {
            try {
                const userId = latestWaterFlowRecord.userId;
                const current = latestWaterFlowRecord.waterFlow;
                const flowUnit = latestWaterFlowRecord.flowUnit || "L/min";
                const pumpStatus = latestWaterFlowRecord.pumpStatus || "OFF";
                // ✅ Convert timestamp to Africa/Kigali timezone
                const rawTimestamp = latestWaterFlowRecord.timeStamp || new Date().toISOString();
                const kigaliTime = luxon_1.DateTime
                    .fromISO(rawTimestamp, { zone: "utc" })
                    .setZone("Africa/Kigali");
                lastWaterFlow = current;
                const data = {
                    userId,
                    flowRate: current,
                    flowUnit,
                    pumpStatus,
                    timestamp: rawTimestamp, // e.g., "2025-07-03T12:34:56.789Z"
                    date: kigaliTime.toFormat("yyyy-MM-dd"), // e.g., "2025-07-03"
                    time: kigaliTime.toFormat("HH:mm:ss"),
                };
                (0, waterFlow_model_1.saveWaterFlowData)(data);
            }
            catch (err) {
                console.error("❌ Error parsing MQTT data:", err.message);
            }
        }
    }, 5000); // every 5 seconds
}
// Start the moisture data loop
async function startMoistureLoop() {
    let lastMoisture = 0;
    console.log("Starting moisture data loop");
    setInterval(() => {
        const raw = (0, moisture_model_1.getRecentMoistureData)();
        const latestMoistureRecord = mqttClient_1.sensorData ? JSON.parse(mqttClient_1.sensorData) : null;
        if (!raw || !latestMoistureRecord) {
            console.warn("📭 No MQTT data available yet.");
            return;
        }
        else {
            try {
                const current = latestMoistureRecord.moisture || 0;
                const change = latestMoistureRecord.moistureChange || 0;
                lastMoisture = current;
                const data = {
                    moisture: current,
                    moistureChange: change,
                    moistureUnit: latestMoistureRecord.moistureUnit || "%",
                };
                (0, moisture_model_1.saveMoistureData)(data);
            }
            catch (err) {
                console.error("❌ Error parsing MQTT data:", err.message);
            }
        }
    }, 5000); // every 1 second
}
// ✅ GET /api/moisture
const fetchRecentMoisture = async (req, res, next) => {
    try {
        if (mqttClient_1.sensorData) {
            const parsed = JSON.parse(mqttClient_1.sensorData);
            res.json({ success: true, source: "MQTT", data: [parsed] });
        }
        else {
            const data = await (0, moisture_model_1.getRecentMoistureData)(20);
            res.json({ success: true, source: "DB", data });
        }
    }
    catch (error) {
        console.error("❌ Failed to fetch moisture data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.fetchRecentMoisture = fetchRecentMoisture;
const fetchRecentWaterFlow = async (req, res, next) => {
    try {
        if (mqttClient_1.sensorData) {
            const parsed = JSON.parse(mqttClient_1.sensorData);
            res.json({ success: true, source: "MQTT", data: [parsed] });
        }
        else {
            const data = await (0, waterFlow_model_1.getRecentWaterFlowData)(20);
            if (data) {
                res.json({ success: true, source: "DB", data });
            }
        }
    }
    catch (error) {
        console.error("❌ Failed to fetch water flow data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.fetchRecentWaterFlow = fetchRecentWaterFlow;
// sensor.controller.ts
const getWaterUsedLast1hr = async (req, res) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 60 * 60 * 1000); // 1 hour ago
        const total = await (0, waterFlow_model_1.getTotalWaterUsed)(start, end);
        res.json({ success: true, totalWaterUsed: total.toFixed(2) });
    }
    catch (error) {
        console.error("❌ Error calculating total water used:", error);
        res.status(500).json({ success: false, message: "Error calculating total water used" });
    }
};
exports.getWaterUsedLast1hr = getWaterUsedLast1hr;
// sensor.controller.ts
const getPumpRuntimeHandler = async (req, res) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 6 * 60 * 60 * 1000); // Last 6 hous
        const runtimeInMinutes = await (0, waterFlow_model_1.getPumpRuntime)(start, end);
        // console.log("Pump runtime in minutes:", runtimeInMinutes.toFixed(0));
        res.json({ success: true, runtimeMinutes: runtimeInMinutes });
    }
    catch (error) {
        console.error("❌ Error fetching pump runtime:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getPumpRuntimeHandler = getPumpRuntimeHandler;
const getFlowRateGraphData = async (req, res) => {
    try {
        const end = new Date();
        const start = new Date(end.getTime() - 60 * 60 * 1000); // 1 hour ago
        console.log("Time Range:", start.toISOString(), "to", end.toISOString());
        const buckets = await (0, waterFlow_model_1.getFlowRateBuckets)(start, end, 1); // 1 minute buckets
        res.json({ success: true, data: buckets });
    }
    catch (error) {
        console.error("❌ Error fetching graph data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch usage graph data." });
    }
};
exports.getFlowRateGraphData = getFlowRateGraphData;
async function fetchAllWaterFlowDataPerUser(req, res) {
    try {
        const userId = Number(req.params.userId);
        const data = await (0, waterFlow_model_1.getAllWaterFlowDataPerUser)(userId);
        console.log("Water flow data for user", userId, ":", data);
        res.json({ success: true, data });
    }
    catch (error) {
        console.error("❌ Error fetching water flow data:", error);
        throw error;
    }
}
const getAllWaterFlowData = async (req, res) => {
    try {
        const result = await (await db_1.db).query(`
      SELECT 
      id, flowRate, flowUnit, pumpStatus, timestamp, TO_CHAR(date, 'YYYY-MM-DD') AS date, time FROM water_flow_sensor_data
      ORDER BY timestamp ASC
    `);
        res.json({ success: true, data: result.rows });
    }
    catch (error) {
        console.error("❌ Error fetching water flow data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getAllWaterFlowData = getAllWaterFlowData;
const getWaterUsageTodayHandler = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({ success: false, message: "Invalid userId" });
        }
        const buckets = await (0, waterFlow_model_1.getWaterUsageTodayBuckets)(userId);
        res.json({ success: true, data: buckets });
    }
    catch (error) {
        console.error("❌ Error fetching today's water usage:", error);
        res.status(500).json({ success: false, message: "Failed to fetch water usage for today" });
    }
};
exports.getWaterUsageTodayHandler = getWaterUsageTodayHandler;
