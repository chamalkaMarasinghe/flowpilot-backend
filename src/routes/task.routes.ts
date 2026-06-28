import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks scoped by role with optional filter and sort
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Case-insensitive substring match on task title only
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, IN_PROGRESS, TESTING, DONE, ALL] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH, ALL] }
 *       - in: query
 *         name: assignedTo
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [dueDate, priority, status, createdAt], default: dueDate }
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task (createdBy set from JWT)
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", taskController.listTasks);
router.post("/", taskController.createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
 *     security: [{ bearerAuth: [] }]
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task
 *     security: [{ bearerAuth: [] }]
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     security: [{ bearerAuth: [] }]
 */
router.get("/:id", taskController.getTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
