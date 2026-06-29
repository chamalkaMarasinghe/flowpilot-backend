import { Schema, type InferSchemaType } from "mongoose";
export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";
declare const userSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type IUser = InferSchemaType<typeof userSchema>;
export declare const User: import("mongoose").Model<{
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    email: string;
    fullName: string;
    passwordHash: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    preferences: {
        sidebarOpen: boolean;
        tableView: "table" | "card";
        theme: "light" | "dark";
    };
    avatarUrl?: string | null | undefined;
    jobTitle?: string | null | undefined;
    department?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=User.d.ts.map