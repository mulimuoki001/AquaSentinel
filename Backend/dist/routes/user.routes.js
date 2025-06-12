"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const userRouter = (0, express_1.Router)();
userRouter.get("/all", auth_middleware_1.authenticateJWT, (0, role_middleware_1.authorizeRoles)("provider", "RAB"), user_controller_1.getUsers);
exports.default = userRouter;
