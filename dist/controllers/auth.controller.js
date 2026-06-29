import { asyncHandler } from "../middleware/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.js";
export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, "Login successful");
});
export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, "Registration successful", 201);
});
export const forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body);
    sendSuccess(res, result, "If an account exists, a reset link has been sent");
});
export const me = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, { user }, "Session retrieved");
});
export const updateMe = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    sendSuccess(res, { user }, "Profile updated");
});
export const updateMyPreferences = asyncHandler(async (req, res) => {
    const user = await authService.updatePreferences(req.user.id, req.body);
    sendSuccess(res, { user }, "Preferences updated");
});
export const logout = asyncHandler(async (_req, res) => {
    sendSuccess(res, { ok: true }, "Logged out successfully");
});
//# sourceMappingURL=auth.controller.js.map