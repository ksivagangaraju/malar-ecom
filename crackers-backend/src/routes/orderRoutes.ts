// src/routes/orderRoutes.ts
import { Router } from "express";
import {
  placeOrder,
  cancelOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Route ni connect chesthunnam (User login ayyaro ledo check chesi appudu placeOrder call avuthundi)
router.post("/", protect, placeOrder);
// Routes define chestunnam (Token unte ne ivvi access avuthayi)
router.post("/place", protect, placeOrder);
router.put("/cancel/:id", protect, cancelOrder);
router.get("/myorders", protect, getMyOrders);

export default router;
