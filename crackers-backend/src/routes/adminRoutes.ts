// src/routes/adminRoutes.ts
import { Router } from "express";
import {
  updateOrderStatus,
  manageCustomerVip,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

// Ee routes ki mundu 'protect' (login ayyada leda), tharuvata 'adminOnly' (admin aa kaada) checking untundi.
router.put("/order/:orderId/status", protect, adminOnly, updateOrderStatus);
router.put("/customer/:customerId/vip", protect, adminOnly, manageCustomerVip);

export default router;
