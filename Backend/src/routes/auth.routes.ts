import { Router } from "express";
import {
  login,
  logout,
  logoutAll,
  register,
  validateToken,
} from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateJWT, logout);
router.get("/validate-token", validateToken);
router.post(
  "/logout-all",
  authenticateJWT,
  authorizeRoles("provider"),
  logoutAll
);

export default router;
