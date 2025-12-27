import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export function authorizeAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}
