import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as taskService from "../services/task.service.js";
import { sendSuccess } from "../utils/response.js";

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.listTasks(req.user!.id, req.user!.role, req.query);
  sendSuccess(res, tasks, "Tasks retrieved");
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTask(req.params.id, req.user!.id, req.user!.role);
  sendSuccess(res, task, "Task retrieved");
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body, req.user!.id);
  sendSuccess(res, task, "Task created", 201);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user!.id, req.user!.role);
  sendSuccess(res, task, "Task updated");
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.deleteTask(req.params.id, req.user!.id, req.user!.role);
  sendSuccess(res, result, "Task deleted");
});
