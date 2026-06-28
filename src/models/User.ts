import { Schema, model, type InferSchemaType } from "mongoose";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

const preferencesSchema = new Schema(
  {
    sidebarOpen: { type: Boolean, default: true },
    tableView: { type: String, enum: ["table", "card"], default: "table" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "USER"] satisfies UserRole[], default: "USER" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] satisfies UserStatus[], default: "ACTIVE" },
    avatarUrl: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = model("User", userSchema);
