import { Router } from "express";
import {
  login,
  logout,
  logoutAll,
  register,
  validateToken,
} from "../controllers/auth.controller";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate-token", validateToken);
router.post("/logout-all", logoutAll);

export default router;
