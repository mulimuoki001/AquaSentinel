import mqtt, { MqttClient } from "mqtt";
import { logPumpSession, getLastPumpStatus } from "../models/pumpSessions.model";
import { setLatestPumpSession } from "./pumpSession.getter";
import { get } from "http";


const brokerUrl = "mqtt://192.168.1.66:1883"; // Your local Mosquitto IP
const clientId = "AquaSentinelBackend";

const mqttClient: MqttClient = mqtt.connect(brokerUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

let sensorData: string | null = null;
let lastStatus: "ON" | "OFF" | null = null;
mqttClient.on("connect", () => {
    mqttClient.subscribe("aquasentinel/status", (err) => {
        if (err) {
            console.error("❌ Failed to subscribe:", err.message);
        } else {
            console.log("📡 Subscribed to 'aquasentinel/status'");
        }
    });
});

mqttClient.on("message", (topic, message) => {
    if (topic === "aquasentinel/status") {
        sensorData = message.toString();
        // console.log("🌱 Soil Moisture Update:", sensorData);
    }
});
// Initialize lastStatus on startup
(async () => {
    lastStatus = await getLastPumpStatus();
    console.log("🔁 Initial pump status:", lastStatus);
})();

mqttClient.on("message", async (topic, message) => {
    if (topic === "aquasentinel/status") {
        try {
            const payload = JSON.parse(message.toString());
            const currentStatus = payload.pumpStatus?.toUpperCase() as "ON" | "OFF";

            if ((currentStatus === "ON" || currentStatus === "OFF") && currentStatus !== lastStatus) {
                console.log(`⚙️ Pump status changed: ${lastStatus} → ${currentStatus}`);
                const session = await logPumpSession(currentStatus);
                setLatestPumpSession(session);
                lastStatus = currentStatus;
            }
        } catch (error) {
            console.error("❌ Failed to parse MQTT payload:", error);
        }
    }
});


mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});

export { mqttClient, sensorData };
