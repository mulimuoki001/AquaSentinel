import dotenv from "dotenv";
import app from "./app";
import { db } from "./config/db"; // Assuming you export the Pool instance here
import { ensureDatabaseAndTables } from "./config/init";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;

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

export default app;
