import { Router } from "express";
import { getUsers, getUserData, updateProfile } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { upload } from "../middleware/upload";

const userRouter = Router();
userRouter.get(
  "/all",
  authenticateJWT,
  authorizeRoles("provider", "RAB"),
  getUsers
);
userRouter.get("/data", authenticateJWT, getUserData);
userRouter.put("/update", authenticateJWT, upload.single("profileImage"), updateProfile);
export default userRouter;
