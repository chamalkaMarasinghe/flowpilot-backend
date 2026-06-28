import type { Document, Types } from "mongoose";
import type { ApiTaskShape } from "./dashboardUtils.js";
import { normalizePreferences, type UserPreferencesShape } from "./userPreferences.js";

type WithId = { _id: Types.ObjectId };

export function toId(doc: WithId | Types.ObjectId | string | null | undefined): string {
  if (!doc) return "";
  if (typeof doc === "string") return doc;
  if ("_id" in doc && doc._id) return String(doc._id);
  return String(doc);
}

export function toApiUser<T extends Document & WithId>(doc: T) {
  const obj = doc.toObject({ virtuals: false });
  const { _id, passwordHash: _, ...rest } = obj as Record<string, unknown>;
  return {
    ...rest,
    id: String(_id),
    createdAt: (obj.createdAt as Date).toISOString(),
    updatedAt: (obj.updatedAt as Date).toISOString(),
  };
}

export function toApiAuthUser<T extends Document & WithId>(doc: T) {
  const user = toApiUser(doc) as Record<string, unknown> & {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
    preferences?: Record<string, unknown>;
    status?: string;
    createdAt: string;
    updatedAt: string;
  };
  const { status: _, createdAt: __, updatedAt: ___, preferences, ...auth } = user;
  return {
    ...auth,
    preferences: normalizePreferences(preferences as Partial<UserPreferencesShape> | undefined),
  };
}

export function toApiTask<T extends Document & WithId>(doc: T): ApiTaskShape {
  const obj = doc.toObject({ virtuals: false });
  const { _id, createdBy, assignedTo, dueDate, ...rest } = obj as Record<string, unknown>;
  return {
    ...(rest as Omit<ApiTaskShape, "id" | "createdBy" | "assignedTo" | "dueDate" | "createdAt" | "updatedAt">),
    id: String(_id),
    createdBy: toId(createdBy as Types.ObjectId),
    assignedTo: toId(assignedTo as Types.ObjectId),
    dueDate: (dueDate as Date).toISOString(),
    createdAt: (obj.createdAt as Date).toISOString(),
    updatedAt: (obj.updatedAt as Date).toISOString(),
  };
}
