// src/controllers/authController.ts

import type { Request, Response } from "express";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

import nodemailer from "nodemailer";

import type { AuthRequest } from "../middleware/authMiddleware.js";

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// 1. Send OTP API (Checks both Email & Phone)

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message:
            "This email address is already registered with another account!",
        });
      }

      if (existingUser.phone === phone) {
        return res.status(400).json({
          message:
            "This phone number is already registered with another account!",
        });
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await transporter.sendMail({
      from: `"Malar Crackers" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Your VIP Account Verification OTP",

      html: `

        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">

          <h2 style="color: #b91c1c;">Malar Crackers</h2>

          <p>Thank you for registering. Your One Time Password (OTP) is:</p>

          <h1 style="font-size: 40px; letter-spacing: 5px; color: #d97706;">${otp}</h1>

          <p style="color: #666;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>

        </div>

      `,
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("OTP Send Error:", error);

    res.status(500).json({
      message: "Internal server error while sending verification OTP.",
    });
  }
};

// 2. Verify OTP & Final Signup API (UPDATED for dob, gender)

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Kotha fields dob, gender theesukuntunnam

    const { name, email, phone, password, otp, dob, gender } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res

        .status(400)

        .json({ message: "OTP session not found. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);

      return res

        .status(400)

        .json({ message: "Verification OTP has expired. Please try again." });
    }

    if (record.otp !== otp) {
      return res

        .status(400)

        .json({
          message: "Invalid 6-digit OTP entered. Please check and try again.",
        });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // User ni save chesetappudu dob, gender add chesthunnam

    const newUser = new User({
      name,

      email,

      phone,

      password: hashedPassword,

      role: "customer",

      isVipGold: false,

      dob,

      gender,
    });

    await newUser.save();

    otpStore.delete(email);

    res

      .status(201)

      .json({ message: "Account created successfully. You can login now." });
  } catch (error) {
    console.error("Signup Error:", error);

    res

      .status(500)

      .json({ message: "Error creating account during final validation." });
  }
};

// 3. Login API Logic

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res

        .status(400)

        .json({ message: "The email address you entered is not registered!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res

        .status(400)

        .json({ message: "Incorrect password! Please check and try again." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, isVipGold: user.isVipGold },

      process.env.JWT_SECRET as string,

      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        isVipGold: user.isVipGold,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res

      .status(500)

      .json({ message: "Server error occurred during user authentication." });
  }
};

// 4. Get User Profile API

export const getUserProfile = async (
  req: AuthRequest,

  res: Response,
): Promise<any> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
