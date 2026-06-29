import { Router } from "express";
import * as searchController from "../controllers/search.controller.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
/**
 * @openapi
 * /search/tasks:
 *   get:
 *     tags: [Search]
 *     summary: Search tasks by title (global nav search)
 *     description: |
 *       Returns tasks the caller can access whose **title** contains the query (case-insensitive).
 *       Does not match description text. ADMIN sees all tasks; USER sees created-by or assigned-to tasks only.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         description: Substring to match against task title
 *     responses:
 *       200:
 *         description: Matching tasks (may be empty)
 *       400:
 *         description: Missing or invalid query
 */
router.get("/tasks", searchController.searchTasks);
export default router;
//# sourceMappingURL=search.routes.js.map