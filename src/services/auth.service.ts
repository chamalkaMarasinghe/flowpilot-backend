import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { toApiAuthUser } from "../utils/toApi.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

function signToken(userId: string, role: "ADMIN" | "USER") {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, options);
}

export async function login(input: unknown) {
  const { email, password } = loginSchema.parse(input);
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user) throw new AppError(401, "No account found for that email");
  if (user.status === "INACTIVE") throw new AppError(403, "Account is deactivated");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, "Incorrect password");

  const token = signToken(String(user._id), user.role);
  return { user: toApiAuthUser(user), token };
}

export async function register(input: unknown) {
  const data = registerSchema.parse(input);
  if (data.password !== data.confirmPassword) throw new AppError(400, "Passwords do not match");

  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) throw new AppError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    passwordHash,
    role: "USER",
    status: "ACTIVE",
  });

  const token = signToken(String(user._id), user.role);
  return { user: toApiAuthUser(user), token };
}

export async function forgotPassword(input: unknown) {
  const { email } = forgotPasswordSchema.parse(input);
  if (!email) throw new AppError(400, "Email is required");
  return { ok: true as const };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User not found");
  if (user.status === "INACTIVE") throw new AppError(403, "Account is deactivated");
  return toApiAuthUser(user);
}

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  jobTitle: z.string().trim().max(120).optional(),
  department: z.string().trim().max(120).optional(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export async function updateProfile(userId: string, input: unknown) {
  const data = updateProfileSchema.parse(input);
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (user.status === "INACTIVE") throw new AppError(403, "Account is deactivated");

  if (data.email !== undefined) {
    const normalized = data.email.toLowerCase();
    const existing = await User.findOne({ email: normalized, _id: { $ne: user._id } });
    if (existing) throw new AppError(409, "Email already in use");
    user.email = normalized;
  }
  if (data.fullName !== undefined) user.fullName = data.fullName;
  if (data.jobTitle !== undefined) user.jobTitle = data.jobTitle || undefined;
  if (data.department !== undefined) user.department = data.department || undefined;
  if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl || undefined;

  await user.save();
  return toApiAuthUser(user);
}

const updatePreferencesSchema = z.object({
  sidebarOpen: z.boolean().optional(),
  tableView: z.enum(["table", "card"]).optional(),
  theme: z.enum(["light", "dark"]).optional(),
});

export async function updatePreferences(userId: string, input: unknown) {
  const data = updatePreferencesSchema.parse(input);
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (user.status === "INACTIVE") throw new AppError(403, "Account is deactivated");

  if (!user.preferences) {
    user.preferences = {
      sidebarOpen: true,
      tableView: "table",
      theme: "light",
    };
  }

  if (data.sidebarOpen !== undefined) user.preferences.sidebarOpen = data.sidebarOpen;
  if (data.tableView !== undefined) user.preferences.tableView = data.tableView;
  if (data.theme !== undefined) user.preferences.theme = data.theme;
  user.markModified("preferences");

  await user.save();
  return toApiAuthUser(user);
}
