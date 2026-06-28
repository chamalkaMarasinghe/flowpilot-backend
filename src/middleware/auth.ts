import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import type { UserRole } from "../models/User.js";

interface JwtPayload {
  sub: string;
  role: UserRole;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  const token = header.slice(7);
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }

  const user = await User.findById(payload.sub);
  if (!user) return next(new AppError(401, "User not found"));
  if (user.status === "INACTIVE") return next(new AppError(403, "Account is deactivated"));

  req.user = { id: String(user._id), role: user.role };
  next();
}
