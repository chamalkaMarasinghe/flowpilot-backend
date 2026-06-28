import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as taskService from "../services/task.service.js";
import { sendSuccess } from "../utils/response.js";

export const searchTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.searchTasksByTitle(req.user!.id, req.user!.role, req.query);
  sendSuccess(res, tasks, "Search results");
});
