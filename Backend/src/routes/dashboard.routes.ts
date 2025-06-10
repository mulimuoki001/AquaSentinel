import { Router } from "express";
import {
  farmerDashboard,
  providerDashboard,
  RABDashboard,
} from "../controllers/dashboard.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
const dashboardRouter = Router();

//Farmer Dashboard Routes
dashboardRouter.get(
  "/farmer",
  authenticateJWT,
  authorizeRoles("farmer"),
  farmerDashboard
);

//Provider Dashboard Routes
dashboardRouter.get(
  "/provider",
  authenticateJWT,
  authorizeRoles("provider"),
  providerDashboard
);

//RAB Dashboard Routes
dashboardRouter.get(
  "/RAB",
  authenticateJWT,
  authorizeRoles("RAB"),
  RABDashboard
);

export default dashboardRouter;
