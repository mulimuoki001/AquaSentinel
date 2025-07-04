import dotenv from "dotenv";
import app from "./app";
import { db } from "./config/db"; // Assuming you export the Pool instance here
import { ensureDatabaseAndTables } from "./config/init";
import { mqttClient } from "./config/mqttClient";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;
let moistureData: string | null = null;
// ✅ Test DB connection before starting server
async function testDbConnection() {
  try {
    const res = await (await db).query("SELECT NOW()");
    console.log("✅ DB Connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    throw err;
  }
}
//Make sure MQTT client is connected
mqttClient.on("connect", () => {
  console.log("✅ MQTT client connected");
});
mqttClient.on("message", (topic, message) => {
  // Store the latest moisture data
  moistureData = message.toString();
  // console.log(`📨 MQTT [${topic}]: ${message.toString()}`);
  // Optionally: parse and store to DB
});


mqttClient.on("error", (err) => {
  console.error("❌ MQTT connection error:", err.message);
});
// Start the server
async function startServer() {
  try {
    await testDbConnection();
    await ensureDatabaseAndTables();

    app.listen(PORT, () => {
      console.log(
        `✅ Server is running on port ${PORT}\n🔗 Local: http://localhost:${PORT}/auth/register`
      );
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
}

startServer();

export { moistureData }; // Export for use in controllers
