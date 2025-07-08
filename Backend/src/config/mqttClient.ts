import mqtt, { MqttClient } from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const brokerUrl = `mqtts://${process.env.MQTT_HOST}`;
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



mqttClient.on("message", (topic, message) => {
    if (topic === "aquasentinel/status") {
        sensorData = message.toString();
    }
});

mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});

export { mqttClient, sensorData };
