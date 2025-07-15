"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moistureData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db"); // Assuming you export the Pool instance here
const init_1 = require("./config/init");
const pumpSessions_model_1 = require("./models/pumpSessions.model");
const pumpSession_getter_1 = require("./config/pumpSession.getter");
const user_model_1 = require("./models/user.model");
const sensor_controller_1 = require("./controllers/sensor.controller");
const smsSender_1 = require("./config/smsSender");
const mqttClient_1 = require("./config/mqttClient");
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const PORT = process.env.PORT || 3000;
let moistureData = null;
exports.moistureData = moistureData;
// ✅ Test DB connection before starting server
async function testDbConnection() {
    try {
        const res = await (await db_1.db).query("SELECT NOW()");
        console.log("✅ DB Connected at:", res.rows[0].now);
    }
    catch (err) {
        console.error("❌ Failed to connect to DB:", err);
        throw err;
    }
}
mqttClient_1.mqttClient.on("connect", () => {
    console.log("✅ MQTT client connected");
    mqttClient_1.mqttClient.subscribe("aquasentinel/status");
});
mqttClient_1.mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});
// Start the server
async function startServer() {
    try {
        await testDbConnection();
        await (0, init_1.ensureDatabaseAndTables)();
        await (0, sensor_controller_1.startMoistureLoop)();
        await (0, sensor_controller_1.startWaterFlowLoop)();
        let lastStatus = null;
        (async () => {
            lastStatus = await (0, pumpSessions_model_1.getLastPumpStatus)();
            console.log("🔁 Initial pump status:", lastStatus);
        })();
        mqttClient_1.mqttClient.on("message", async (topic, message) => {
            if (topic === "aquasentinel/status") {
                try {
                    exports.moistureData = moistureData = message.toString();
                    const payload = JSON.parse(message.toString());
                    const currentStatus = payload.pumpStatus?.toUpperCase();
                    const userId = payload.userId;
                    if ((currentStatus === "ON" || currentStatus === "OFF") && currentStatus !== lastStatus) {
                        console.log(`⚙️ Pump status changed: ${lastStatus} → ${currentStatus}`);
                        const session = await (0, pumpSessions_model_1.logPumpSession)(currentStatus, userId);
                        const message = `Pump turmed: ${currentStatus}`;
                        if (userId) {
                            const { farmphone: phoneNumber } = await (0, user_model_1.getPhoneNumberByUserId)(userId);
                            if (phoneNumber) {
                                (0, smsSender_1.sendSMS)(phoneNumber, message);
                            }
                        }
                        (0, pumpSession_getter_1.setLatestPumpSession)(session);
                        lastStatus = currentStatus;
                    }
                }
                catch (error) {
                    console.error("❌ Failed to parse MQTT payload:", error);
                }
            }
        });
        app_1.default.get('/weather', async (req, res) => {
            const url = `https://api.weatherapi.com/v1/forecast.json?key=4526809b079e426d84b163312250607&q=Kigali&days=2&aqi=no&alerts=no
`;
            const response = await fetch(url);
            const data = await response.json();
            res.json(data);
        });
        app_1.default.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}\n🔗 ${PORT}/auth/register`);
        });
    }
    catch (err) {
        console.error("❌ Startup error:", err);
        process.exit(1);
    }
}
startServer();
