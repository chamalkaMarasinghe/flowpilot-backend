import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.length ? e.path.join(".") : undefined,
      message: e.message,
    }));
    return sendError(res, 400, "Validation failed", errors);
  }

  if (err instanceof Error && err.name === "ValidationError") {
    return sendError(res, 400, err.message);
  }

  if (err instanceof Error && "code" in err && (err as { code?: number }).code === 11000) {
    return sendError(res, 409, "Email already registered", [
      { field: "email", message: "Email already registered" },
    ]);
  }

  console.error(err);
  return sendError(res, 500, "Internal server error");
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
}
