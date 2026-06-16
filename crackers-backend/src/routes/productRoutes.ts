// src/routes/productRoutes.ts
import { Router } from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/add", protect, createProduct);
router.get("/all", getProducts);

export default router;
