import { Schema, type InferSchemaType } from "mongoose";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
declare const taskSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type ITask = InferSchemaType<typeof taskSchema>;
export declare const Task: import("mongoose").Model<{
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
    description: string;
    dueDate: NativeDate;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: import("mongoose").Types.ObjectId;
    assignedTo: import("mongoose").Types.ObjectId;
    title: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=Task.d.ts.map