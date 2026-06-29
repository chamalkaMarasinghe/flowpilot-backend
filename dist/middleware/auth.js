import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
export async function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new AppError(401, "Authentication required"));
    }
    const token = header.slice(7);
    let payload;
    try {
        payload = jwt.verify(token, env.JWT_SECRET);
    }
    catch {
        return next(new AppError(401, "Invalid or expired token"));
    }
    const user = await User.findById(payload.sub);
    if (!user)
        return next(new AppError(401, "User not found"));
    if (user.status === "INACTIVE")
        return next(new AppError(403, "Account is deactivated"));
    req.user = { id: String(user._id), role: user.role };
    next();
}
//# sourceMappingURL=auth.js.map