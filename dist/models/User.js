import { Schema, model } from "mongoose";
const preferencesSchema = new Schema({
    sidebarOpen: { type: Boolean, default: true },
    tableView: { type: String, enum: ["table", "card"], default: "table" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
}, { _id: false });
const userSchema = new Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    avatarUrl: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    preferences: { type: preferencesSchema, default: () => ({}) },
}, { timestamps: true });
export const User = model("User", userSchema);
//# sourceMappingURL=User.js.map