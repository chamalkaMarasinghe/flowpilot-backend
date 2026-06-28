import { Types } from "mongoose";
import { z } from "zod";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { toApiTask } from "../utils/toApi.js";
import type { UserRole } from "../models/User.js";
import {
  buildRecentActivity,
  computeSummary,
  filterMyTasks,
  filterTasksByPeriod,
  filterTasksList,
  getCompletionRate,
  getDueSoonTasks,
  getStatusChartData,
  getStatusPipeline,
  getTasksTrendData,
  getUrgentTasks,
  sortTasks,
  type DashboardPeriod,
  type TaskFocus,
} from "../utils/dashboardUtils.js";

const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().default(""),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "TESTING", "DONE"]),
  dueDate: z.string().datetime(),
  assignedTo: z.string().min(1),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "TESTING", "DONE"]).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().min(1).optional(),
});

const listTasksQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  sort: z.enum(["dueDate", "priority", "status", "createdAt"]).optional().default("dueDate"),
});

const dashboardQuerySchema = z.object({
  period: z.enum(["today", "week", "month", "all"]).optional().default("month"),
  taskFocus: z.enum(["today", "upcoming"]).optional().default("today"),
});

export function taskScopeFilter(userId: string, role: UserRole) {
  if (role === "ADMIN") return {};
  return {
    $or: [{ createdBy: new Types.ObjectId(userId) }, { assignedTo: new Types.ObjectId(userId) }],
  };
}

function canAccessTask(
  task: { createdBy: Types.ObjectId; assignedTo: Types.ObjectId },
  userId: string,
  role: UserRole,
) {
  if (role === "ADMIN") return true;
  return String(task.createdBy) === userId || String(task.assignedTo) === userId;
}

async function validateAssignee(assigneeId: string) {
  if (!Types.ObjectId.isValid(assigneeId)) throw new AppError(400, "Invalid assignee");
  const user = await User.findById(assigneeId);
  if (!user) throw new AppError(400, "Assignee not found");
  if (user.status === "INACTIVE") throw new AppError(400, "Cannot assign to inactive user");
}

export async function getScopedTasks(userId: string, role: UserRole) {
  const tasks = await Task.find(taskScopeFilter(userId, role)).sort({ updatedAt: -1 });
  return tasks.map(toApiTask);
}

export async function listTasks(userId: string, role: UserRole, queryInput: unknown = {}) {
  const query = listTasksQuerySchema.parse(queryInput);
  const scoped = await getScopedTasks(userId, role);
  const filtered = filterTasksList(scoped, query);
  return sortTasks(filtered, query.sort);
}

const searchTasksQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

export async function searchTasksByTitle(userId: string, role: UserRole, queryInput: unknown) {
  const { q } = searchTasksQuerySchema.parse(queryInput);
  const scoped = await getScopedTasks(userId, role);
  const lower = q.toLowerCase();
  return scoped.filter((t) => t.title.toLowerCase().includes(lower));
}

export async function getTask(id: string, userId: string, role: UserRole) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "Task not found");
  const task = await Task.findById(id);
  if (!task) throw new AppError(404, "Task not found");
  if (!canAccessTask(task, userId, role)) throw new AppError(403, "Access denied");
  return toApiTask(task);
}

export async function createTask(input: unknown, userId: string) {
  const data = createTaskSchema.parse(input);
  await validateAssignee(data.assignedTo);

  const task = await Task.create({
    ...data,
    dueDate: new Date(data.dueDate),
    createdBy: new Types.ObjectId(userId),
    assignedTo: new Types.ObjectId(data.assignedTo),
  });

  return toApiTask(task);
}

export async function updateTask(id: string, input: unknown, userId: string, role: UserRole) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "Task not found");
  const data = updateTaskSchema.parse(input);

  const task = await Task.findById(id);
  if (!task) throw new AppError(404, "Task not found");
  if (!canAccessTask(task, userId, role)) throw new AppError(403, "Access denied");

  if (data.assignedTo) await validateAssignee(data.assignedTo);

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.priority !== undefined) task.priority = data.priority;
  if (data.status !== undefined) task.status = data.status;
  if (data.dueDate !== undefined) task.dueDate = new Date(data.dueDate);
  if (data.assignedTo !== undefined) task.assignedTo = new Types.ObjectId(data.assignedTo);

  await task.save();
  return toApiTask(task);
}

export async function deleteTask(id: string, userId: string, role: UserRole) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "Task not found");
  const task = await Task.findById(id);
  if (!task) throw new AppError(404, "Task not found");
  if (!canAccessTask(task, userId, role)) throw new AppError(403, "Access denied");

  await task.deleteOne();
  return { id };
}

export async function getDashboard(userId: string, role: UserRole, queryInput: unknown = {}) {
  const query = dashboardQuerySchema.parse(queryInput);
  const period = query.period as DashboardPeriod;
  const taskFocus = query.taskFocus as TaskFocus;

  const scoped = await getScopedTasks(userId, role);
  const filtered = filterTasksByPeriod(scoped, period);
  const summary = computeSummary(filtered, userId);

  return {
    summary,
    completionRate: getCompletionRate(filtered),
    statusChart: getStatusChartData(filtered),
    trend: getTasksTrendData(scoped),
    pipeline: getStatusPipeline(filtered),
    myTasks: filterMyTasks(scoped, userId, taskFocus),
    dueSoon: getDueSoonTasks(filtered),
    urgent: getUrgentTasks(filtered),
    recentActivity: buildRecentActivity(scoped),
    period,
    taskFocus,
  };
}
