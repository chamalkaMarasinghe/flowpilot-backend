import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
const router = Router();
router.use(authenticate);
/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (for assignee selection)
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", userController.listUsers);
/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Activate or deactivate a user (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/:id/status", requireAdmin, userController.setStatus);
/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Change user role (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/:id/role", requireAdmin, userController.setRole);
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Permanently delete a user (admin only)
 *     description: |
 *       Removes the user and all tasks they created or were assigned to.
 *       Cannot delete yourself or the last active admin.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Cannot delete self or last admin
 */
router.delete("/:id", requireAdmin, userController.remove);
export default router;
//# sourceMappingURL=user.routes.js.map