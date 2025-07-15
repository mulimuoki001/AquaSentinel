"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const dashboardRouter = (0, express_1.Router)();
//Farmer Dashboard Routes
dashboardRouter.get("/farmer", auth_middleware_1.authenticateJWT, (0, role_middleware_1.authorizeRoles)("farmer"), dashboard_controller_1.farmerDashboard);
//Provider Dashboard Routes
dashboardRouter.get("/provider", auth_middleware_1.authenticateJWT, (0, role_middleware_1.authorizeRoles)("provider"), dashboard_controller_1.providerDashboard);
//RAB Dashboard Routes
dashboardRouter.get("/RAB", auth_middleware_1.authenticateJWT, (0, role_middleware_1.authorizeRoles)("RAB"), dashboard_controller_1.RABDashboard);
exports.default = dashboardRouter;
