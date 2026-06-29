import { Types } from "mongoose";
import type { UserRole } from "../models/User.js";
import { type DashboardPeriod, type TaskFocus } from "../utils/dashboardUtils.js";
export declare function taskScopeFilter(userId: string, role: UserRole): {
    $or?: undefined;
} | {
    $or: ({
        createdBy: Types.ObjectId;
        assignedTo?: undefined;
    } | {
        assignedTo: Types.ObjectId;
        createdBy?: undefined;
    })[];
};
export declare function getScopedTasks(userId: string, role: UserRole): Promise<import("../utils/dashboardUtils.js").ApiTaskShape[]>;
export declare function listTasks(userId: string, role: UserRole, queryInput?: unknown): Promise<import("../utils/dashboardUtils.js").ApiTaskShape[]>;
export declare function searchTasksByTitle(userId: string, role: UserRole, queryInput: unknown): Promise<import("../utils/dashboardUtils.js").ApiTaskShape[]>;
export declare function getTask(id: string, userId: string, role: UserRole): Promise<import("../utils/dashboardUtils.js").ApiTaskShape>;
export declare function createTask(input: unknown, userId: string): Promise<import("../utils/dashboardUtils.js").ApiTaskShape>;
export declare function updateTask(id: string, input: unknown, userId: string, role: UserRole): Promise<import("../utils/dashboardUtils.js").ApiTaskShape>;
export declare function deleteTask(id: string, userId: string, role: UserRole): Promise<{
    id: string;
}>;
export declare function getDashboard(userId: string, role: UserRole, queryInput?: unknown): Promise<{
    summary: {
        totalTasks: number;
        openTasks: number;
        inProgressTasks: number;
        testingTasks: number;
        doneTasks: number;
        overdueTasks: number;
        assignedToMe: number;
        highPriorityTasks: number;
    };
    completionRate: number;
    statusChart: {
        status: import("../utils/dashboardUtils.js").TaskStatus;
        label: string;
        value: number;
        fill: string;
    }[];
    trend: {
        label: string;
        created: number;
        completed: number;
    }[];
    pipeline: {
        status: import("../utils/dashboardUtils.js").TaskStatus;
        label: string;
        count: number;
        percent: number;
        color: string;
    }[];
    myTasks: import("../utils/dashboardUtils.js").ApiTaskShape[];
    dueSoon: import("../utils/dashboardUtils.js").ApiTaskShape[];
    urgent: import("../utils/dashboardUtils.js").ApiTaskShape[];
    recentActivity: import("../utils/dashboardUtils.js").ActivityLogShape[];
    period: DashboardPeriod;
    taskFocus: TaskFocus;
}>;
//# sourceMappingURL=task.service.d.ts.map