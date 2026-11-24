import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);

// /api/auth/profile
router.get("/profile", protect, getProfile);

export default router;
