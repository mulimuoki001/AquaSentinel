"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db"); // Assuming you export the Pool instance here
const init_1 = require("./config/init");
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const PORT = process.env.PORT || 3000;
// ✅ Test DB connection before starting server
async function testDbConnection() {
    try {
        const res = await db_1.db.query("SELECT NOW()");
        console.log("✅ DB Connected at:", res.rows[0].now);
    }
    catch (err) {
        console.error("❌ Failed to connect to DB:", err);
        throw err;
    }
}
async function startServer() {
    try {
        await testDbConnection();
        await (0, init_1.ensureDatabaseAndTables)();
        app_1.default.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}\n🔗 Local: http://localhost:${PORT}/auth/register`);
        });
    }
    catch (err) {
        console.error("❌ Startup error:", err);
        process.exit(1);
    }
}
startServer();
exports.default = app_1.default;
