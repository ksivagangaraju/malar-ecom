// src/server.ts
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined in environment variables");
}

mongoose
  .connect(MONGO_URI)
  .then(() =>
    console.log("🔥 MongoDB Advanced Premium Database Connected Successfully!"),
  )
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.send("Crackers E-Commerce Premium Backend API Running...");
});

app.listen(PORT as number, "127.0.0.1", () => {
  console.log(`🚀 Server running in premium mode on http://127.0.0.1:${PORT}`);
});
