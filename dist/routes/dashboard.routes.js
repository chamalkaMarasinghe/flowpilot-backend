import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard metrics and panels for the current user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [today, week, month, all], default: month }
 *       - in: query
 *         name: taskFocus
 *         schema: { type: string, enum: [today, upcoming], default: today }
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardData'
 */
router.get("/", dashboardController.getDashboard);
export default router;
//# sourceMappingURL=dashboard.routes.js.map