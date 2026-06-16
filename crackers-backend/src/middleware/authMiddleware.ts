// src/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Request ki user property add cheyadaniki interface
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): any => {
  let token;

  // Headers lo token undo ledo check chestunnam
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Array nundi exact token string ni theesukuntunnam
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing!" });
  }

  if (Array.isArray(token)) {
    token = token;
  } else if (typeof token !== "string") {
    token = String(token);
  }

  try {
    // Token valid oo kado verify chesi, user data ni req ki attach chestunnam
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    // Error vachinappudu terminal lo check cheyadaniki debug log
    console.error("🔴 JWT Error Details:", error);
    res.status(401).json({ message: "Token failed or expired!" });
  }
};
