import mqtt, { MqttClient } from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const brokerUrl = `mqtts://${process.env.MQTT_HOST}`; // e.g., aquasentinel-cluster-xxx.hivemq.cloud
const clientId = "AquaSentinelBackend";

const mqttClient: MqttClient = mqtt.connect(brokerUrl, {
    clientId,
    port: parseInt(process.env.MQTT_PORT || "8883"),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});

let sensorData: string | null = null;

mqttClient.on("connect", () => {
    console.log("✅ Connected to HiveMQ MQTT broker");

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
        console.log("🌱 Soil Moisture Update:", sensorData);
    }
});

mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});

export { mqttClient, sensorData };
