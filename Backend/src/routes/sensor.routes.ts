import { Router } from "express";
import { fetchRecentMoisture, getWaterUsedLast1hr, fetchRecentWaterFlow, getPumpRuntimeHandler, getFlowRateGraphData, getAllWaterFlowData, getWaterUsageTodayHandler, fetchAllWaterFlowDataPerUser } from "../controllers/sensor.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { getLivePumpSession, getAllPumpSessions, getUserPumpSessions, getTotalWaterUsedDailybyUser } from "../controllers/pumpSessions.controller";
import { authorizeRoles } from "../middleware/role.middleware";
import { getUserSensorData } from "../controllers/userSensorData";
import { get } from "http";

const moistureRouter = Router();

// ✅ GET /api/sensors/moisture
moistureRouter.get("/moisture", fetchRecentMoisture);
moistureRouter.get("/moisture-data", fetchRecentMoisture, authenticateJWT); // Alias for /moisture
// ✅ GET /api/sensors/water-flow
moistureRouter.get("/water-flow", fetchRecentWaterFlow);
moistureRouter.get("/water-flow-data", fetchRecentWaterFlow, authenticateJWT); // Alias for /water-flow
moistureRouter.get("/water-used-last-1hr", getWaterUsedLast1hr, authenticateJWT); // Get water used in last 1 hour in minutes
moistureRouter.get("/pump-runtime", getPumpRuntimeHandler, authenticateJWT); // Get water used in last 1 hour
moistureRouter.get("/flow-rate-graph", getFlowRateGraphData, authenticateJWT); // Get water usage graph data
moistureRouter.get("/all-water-flow-data", getAllWaterFlowData, authenticateJWT);
moistureRouter.get("/water-usage-today/:userId", getWaterUsageTodayHandler);
moistureRouter.get("/all-water-flow-data-per-user/:userId", fetchAllWaterFlowDataPerUser);


// Pump Session
moistureRouter.get("/live-pump-session", getLivePumpSession, authenticateJWT);
moistureRouter.get("/all-pump-sessions", getAllPumpSessions, authenticateJWT, authorizeRoles("provider"));
moistureRouter.get("/user-pump-sessions/:userId", getUserPumpSessions, authenticateJWT);
moistureRouter.get("/total-water-used-daily-by-user/:userId", getTotalWaterUsedDailybyUser, authenticateJWT);

// Get provider recommendations
moistureRouter.get("/user-sensor-data/:userId", getUserSensorData, authenticateJWT);
export default moistureRouter;
