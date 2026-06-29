import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";
export function errorHandler(err, _req, res, _next) {
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
    if (err instanceof Error && "code" in err && err.code === 11000) {
        return sendError(res, 409, "Email already registered", [
            { field: "email", message: "Email already registered" },
        ]);
    }
    console.error(err);
    return sendError(res, 500, "Internal server error");
}
export function notFoundHandler(req, _res, next) {
    next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
}
//# sourceMappingURL=errorHandler.js.map