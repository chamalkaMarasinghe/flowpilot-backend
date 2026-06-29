import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", authController.login);
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 */
router.post("/register", authController.register);
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email (stub)
 */
router.post("/forgot-password", authController.forgotPassword);
/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me", authenticate, authController.me);
/**
 * @openapi
 * /auth/me:
 *   patch:
 *     tags: [Auth]
 *     summary: Update current user profile
 *     description: |
 *       Update your own profile fields. Role and status cannot be changed here (admin user management endpoints apply).
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               jobTitle: { type: string }
 *               department: { type: string }
 *               avatarUrl: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Updated profile
 *       409:
 *         description: Email already in use
 */
router.patch("/me", authenticate, authController.updateMe);
/**
 * @openapi
 * /auth/me/preferences:
 *   patch:
 *     tags: [Auth]
 *     summary: Update current user workspace preferences
 *     description: |
 *       Persists per-user settings (sidebar default, task view, theme). Partial updates are supported.
 *       Each user receives their own preferences on login and session hydration.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sidebarOpen: { type: boolean, description: Sidebar expanded by default }
 *               tableView: { type: string, enum: [table, card] }
 *               theme: { type: string, enum: [light, dark] }
 *     responses:
 *       200:
 *         description: Updated user with preferences
 */
router.patch("/me/preferences", authenticate, authController.updateMyPreferences);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current session (client should discard token)
 *     security: [{ bearerAuth: [] }]
 */
router.post("/logout", authenticate, authController.logout);
export default router;
//# sourceMappingURL=auth.routes.js.map