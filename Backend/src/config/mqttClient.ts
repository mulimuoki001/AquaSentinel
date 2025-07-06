import mqtt, { MqttClient } from "mqtt";
import { logPumpSession, getLastPumpStatus } from "../models/pumpSessions.model";



const brokerUrl = "mqtt://192.168.1.66:1883"; // Your local Mosquitto IP
const clientId = "AquaSentinelBackend";

const mqttClient: MqttClient = mqtt.connect(brokerUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

let sensorData: string | null = null;
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






mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});

export { mqttClient, sensorData };
