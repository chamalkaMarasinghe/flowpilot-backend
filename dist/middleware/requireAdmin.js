import { AppError } from "../utils/errors.js";
export function requireAdmin(req, _res, next) {
    if (!req.user)
        return next(new AppError(401, "Authentication required"));
    if (req.user.role !== "ADMIN")
        return next(new AppError(403, "Admin access required"));
    next();
}
//# sourceMappingURL=requireAdmin.js.map