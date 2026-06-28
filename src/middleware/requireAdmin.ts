import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new AppError(401, "Authentication required"));
  if (req.user.role !== "ADMIN") return next(new AppError(403, "Admin access required"));
  next();
}
