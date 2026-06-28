import { Types } from "mongoose";
import { z } from "zod";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { toApiUser } from "../utils/toApi.js";

const statusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

const roleSchema = z.object({
  role: z.enum(["ADMIN", "USER"]),
});

export async function listUsers() {
  const users = await User.find().sort({ fullName: 1 });
  return users.map(toApiUser);
}

export async function setUserStatus(id: string, input: unknown, actorId: string) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "User not found");
  const { status } = statusSchema.parse(input);

  if (id === actorId && status === "INACTIVE") {
    throw new AppError(400, "Cannot deactivate your own account");
  }

  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (user.role === "ADMIN" && status === "INACTIVE") {
    const adminCount = await User.countDocuments({ role: "ADMIN", status: "ACTIVE" });
    if (adminCount <= 1) throw new AppError(400, "Cannot deactivate the last active admin");
  }

  user.status = status;
  await user.save();
  return toApiUser(user);
}

export async function setUserRole(id: string, input: unknown, actorId: string) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "User not found");
  const { role } = roleSchema.parse(input);

  if (id === actorId && role !== "ADMIN") {
    throw new AppError(400, "Cannot change your own role");
  }

  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (user.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await User.countDocuments({ role: "ADMIN", status: "ACTIVE" });
    if (adminCount <= 1) throw new AppError(400, "Cannot demote the last active admin");
  }

  user.role = role;
  await user.save();
  return toApiUser(user);
}

export async function deleteUser(id: string, actorId: string) {
  if (!Types.ObjectId.isValid(id)) throw new AppError(404, "User not found");
  if (id === actorId) throw new AppError(400, "Cannot delete your own account");

  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (user.role === "ADMIN" && user.status === "ACTIVE") {
    const adminCount = await User.countDocuments({ role: "ADMIN", status: "ACTIVE" });
    if (adminCount <= 1) throw new AppError(400, "Cannot delete the last active admin");
  }

  const userObjectId = new Types.ObjectId(id);
  await Task.deleteMany({
    $or: [{ createdBy: userObjectId }, { assignedTo: userObjectId }],
  });
  await user.deleteOne();
  return { id };
}
