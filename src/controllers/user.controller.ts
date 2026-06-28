import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as userService from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.listUsers();
  sendSuccess(res, users, "Users retrieved");
});

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.setUserStatus(req.params.id, req.body, req.user!.id);
  sendSuccess(res, user, "User status updated");
});

export const setRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.setUserRole(req.params.id, req.body, req.user!.id);
  sendSuccess(res, user, "User role updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id, req.user!.id);
  sendSuccess(res, result, "User deleted");
});
