"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorData = exports.mqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const brokerUrl = `mqtts://${process.env.MQTT_HOST}`;
const clientId = "AquaSentinelBackend";
const mqttClient = mqtt_1.default.connect(brokerUrl, {
    clientId,
    port: parseInt(process.env.MQTT_PORT || "8883"),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});
exports.mqttClient = mqttClient;
let sensorData = null;
exports.sensorData = sensorData;
mqttClient.on("message", (topic, message) => {
    if (topic === "aquasentinel/status") {
        exports.sensorData = sensorData = message.toString();
    }
});
mqttClient.on("error", (err) => {
    console.error("❌ MQTT connection error:", err.message);
});
