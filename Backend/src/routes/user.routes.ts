import { Router } from "express";
import { getUsers, getUserData } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
const userRouter = Router();
userRouter.get(
  "/all",
  authenticateJWT,
  authorizeRoles("provider", "RAB"),
  getUsers
);
userRouter.get("/data", authenticateJWT, getUserData);
export default userRouter;
