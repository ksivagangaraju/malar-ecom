// src/routes/authRoutes.ts

import { Router } from "express";

import {
  signup,
  login,
  sendOtp,
  getUserProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/send-otp", sendOtp); // Kotha route idhi

// POST requests kosam routes define chestunnam

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", protect, getUserProfile);

export default router;
