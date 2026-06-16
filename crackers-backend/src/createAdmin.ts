// src/createAdmin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/User.js";

// .env variables load cheyadaniki
dotenv.config();

const createAdminAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🔥 DB Connected for Admin Creation");

    // Admin already unnado ledo check chestunnam
    const adminExists = await User.findOne({ email: "admin@superk.com" });
    if (adminExists) {
      console.log("⚠️ Admin account already exists in DB!");
      process.exit(0);
    }

    // Password ni encrypt chestunnam
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("AdminSecret2026", salt);

    // Kotha admin user ni create chestunnam (Customer kadu, role 'admin' isthunnam)
    const admin = new User({
      name: "SuperK Admin",
      email: "admin@superk.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
      isVipGold: true,
    });

    await admin.save();
    console.log("✅ Secret Admin Account Created Successfully!");
    process.exit(0); // Script close aipotundi
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdminAccount();
