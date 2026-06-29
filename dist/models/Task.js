import { Schema, model } from "mongoose";
const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true,
    },
    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "TESTING", "DONE"],
        required: true,
    },
    dueDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
export const Task = model("Task", taskSchema);
//# sourceMappingURL=Task.js.map