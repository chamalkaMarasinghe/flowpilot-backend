import { Schema, model, type InferSchemaType } from "mongoose";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"] satisfies TaskPriority[],
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "TESTING", "DONE"] satisfies TaskStatus[],
      required: true,
    },
    dueDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export type ITask = InferSchemaType<typeof taskSchema>;

export const Task = model("Task", taskSchema);
