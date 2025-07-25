import dotenv from "dotenv";
import app from "./app";
import { db } from "./config/db"; // Assuming you export the Pool instance here
import { ensureDatabaseAndTables } from "./config/init";
import { getLastPumpStatus, logPumpSession } from "./models/pumpSessions.model";
import { setLatestPumpSession } from "./config/pumpSession.getter";
import { getPhoneNumberByUserId } from "./models/user.model";
import { startMoistureLoop, startWaterFlowLoop } from "./controllers/sensor.controller";
import { sendSMS } from "./config/smsSender";
import { logoutAll } from "./controllers/auth.controller";
import { mqttClient } from "./config/mqttClient";
import { log } from "console";
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
mqttClient.on("connect", () => {
  console.log("✅ MQTT client connected");
  mqttClient.subscribe("aquasentinel/status");
})
mqttClient.on("error", (err: Error) => {
  console.error("❌ MQTT connection error:", err.message);
})


// Start the server
async function startServer() {
  try {
    await testDbConnection();
    await ensureDatabaseAndTables();
    // Clear all sessions on startup

    await startMoistureLoop();
    await startWaterFlowLoop();

    let lastStatus: "ON" | "OFF" | null = null;
    (async () => {
      lastStatus = await getLastPumpStatus();
      console.log("🔁 Initial pump status:", lastStatus);
    })();
    mqttClient.on("message", async (topic: string, message: Buffer) => {
      if (topic === "aquasentinel/status") {
        try {
          moistureData = message.toString();
          const payload = JSON.parse(message.toString());
          const currentStatus = payload.pumpStatus?.toUpperCase() as "ON" | "OFF";
          const userId = payload.userId;

          if ((currentStatus === "ON" || currentStatus === "OFF") && currentStatus !== lastStatus) {
            console.log(`⚙️ Pump status changed: ${lastStatus} → ${currentStatus}`);
            const session = await logPumpSession(currentStatus, userId);
            let notificationMessage: { en: string; rw: string };
            if (currentStatus === "ON") {
              notificationMessage = {
                en: `Pump turned on. `,
                rw: `Kinywani kizamye. `,
              };
            } else if (currentStatus === "OFF") {
              notificationMessage = {
                en: `Pump turned off.`,
                rw: `Kinywani kizimye.`,
              };
            }
            else {
              notificationMessage = {
                en: `Pump status changed to ${currentStatus}`,
                rw: `Kinywani kizamye. `,
              };
            }

            if (userId) {
              const { farmphone: phoneNumber } = await getPhoneNumberByUserId(userId);

              if (phoneNumber && message) {
                sendSMS(phoneNumber, (notificationMessage.en + notificationMessage.rw));
              }

            }
            setLatestPumpSession(session);

            lastStatus = currentStatus;
          }
        } catch (error) {
          console.error("❌ Failed to parse MQTT payload:", error);
        }
      }
    });

    app.get('/weather', async (req, res) => {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=4526809b079e426d84b163312250607&q=Kigali&days=2&aqi=no&alerts=no
`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    });




    app.listen(PORT, () => {
      console.log(
        `✅ Server is running on port ${PORT}\n🔗 ${PORT}/auth/register`
      );
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
}

startServer();

export { moistureData }; // Export for use in controllers
