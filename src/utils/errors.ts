import type { ApiFieldError } from "./response.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: ApiFieldError[],
  ) {
    super(message);
    this.name = "AppError";
  }
}
