"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensor_controller_1 = require("../controllers/sensor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const pumpSessions_controller_1 = require("../controllers/pumpSessions.controller");
const moistureRouter = (0, express_1.Router)();
// ✅ GET /api/sensors/moisture
moistureRouter.get("/moisture", sensor_controller_1.fetchRecentMoisture);
moistureRouter.get("/moisture-data", sensor_controller_1.fetchRecentMoisture, auth_middleware_1.authenticateJWT); // Alias for /moisture
// ✅ GET /api/sensors/water-flow
moistureRouter.get("/water-flow", sensor_controller_1.fetchRecentWaterFlow);
moistureRouter.get("/water-flow-data", sensor_controller_1.fetchRecentWaterFlow, auth_middleware_1.authenticateJWT); // Alias for /water-flow
moistureRouter.get("/water-used-last-1hr", sensor_controller_1.getWaterUsedLast1hr, auth_middleware_1.authenticateJWT); // Get water used in last 1 hour in minutes
moistureRouter.get("/pump-runtime", sensor_controller_1.getPumpRuntimeHandler, auth_middleware_1.authenticateJWT); // Get water used in last 1 hour
moistureRouter.get("/flow-rate-graph", sensor_controller_1.getFlowRateGraphData, auth_middleware_1.authenticateJWT); // Get water usage graph data
moistureRouter.get("/all-water-flow-data", sensor_controller_1.getAllWaterFlowData, auth_middleware_1.authenticateJWT);
moistureRouter.get("/water-usage-today/:userId", sensor_controller_1.getWaterUsageTodayHandler);
moistureRouter.get("/all-water-flow-data-per-user/:userId", sensor_controller_1.fetchAllWaterFlowDataPerUser);
// Pump Session
moistureRouter.get("/live-pump-session", pumpSessions_controller_1.getLivePumpSession, auth_middleware_1.authenticateJWT);
moistureRouter.get("/all-pump-sessions", pumpSessions_controller_1.getAllPumpSessions, auth_middleware_1.authenticateJWT);
moistureRouter.get("/user-pump-sessions/:userId", pumpSessions_controller_1.getUserPumpSessions, auth_middleware_1.authenticateJWT);
moistureRouter.get("/total-water-used-daily-by-user/:userId", pumpSessions_controller_1.getTotalWaterUsedDailybyUser, auth_middleware_1.authenticateJWT);
// Delete all water flow data (for testing purposes)
// moistureRouter.delete("/delete-all-water-flow-data", async (req, res) => await getAllWaterFlowData(req, res));
exports.default = moistureRouter;
