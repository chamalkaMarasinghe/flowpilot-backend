import type { Response } from "express";

export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: ApiFieldError[];
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Record<string, unknown>,
) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ApiFieldError[],
) {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    ...(errors?.length ? { errors } : {}),
  };
  return res.status(statusCode).json(body);
}
