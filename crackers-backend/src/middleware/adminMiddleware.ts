// src/middleware/adminMiddleware.ts
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware.js";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): any => {
  // Token nundi vachina user role 'admin' ayithe ne allow chestham
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied! Admin strictly only." });
  }
};
