export type DashboardPeriod = "today" | "week" | "month" | "all";
export type TaskFocus = "today" | "upcoming";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export interface ApiTaskShape {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    createdBy: string;
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
}
export interface ActivityLogShape {
    id: string;
    type: "TASK_CREATED" | "TASK_UPDATED" | "STATUS_CHANGED";
    message: string;
    taskId?: string;
    userId: string;
    createdAt: string;
}
export declare function filterTasksByPeriod(tasks: ApiTaskShape[], period: DashboardPeriod): ApiTaskShape[];
export declare function filterMyTasks(tasks: ApiTaskShape[], userId: string, focus: TaskFocus): ApiTaskShape[];
export declare function computeSummary(tasks: ApiTaskShape[], currentUserId?: string): {
    totalTasks: number;
    openTasks: number;
    inProgressTasks: number;
    testingTasks: number;
    doneTasks: number;
    overdueTasks: number;
    assignedToMe: number;
    highPriorityTasks: number;
};
export declare function getStatusChartData(tasks: ApiTaskShape[]): {
    status: TaskStatus;
    label: string;
    value: number;
    fill: string;
}[];
export declare function getTasksTrendData(tasks: ApiTaskShape[]): {
    label: string;
    created: number;
    completed: number;
}[];
export declare function getStatusPipeline(tasks: ApiTaskShape[]): {
    status: TaskStatus;
    label: string;
    count: number;
    percent: number;
    color: string;
}[];
export declare function getDueSoonTasks(tasks: ApiTaskShape[], limit?: number): ApiTaskShape[];
export declare function getUrgentTasks(tasks: ApiTaskShape[], limit?: number): ApiTaskShape[];
export declare function getCompletionRate(tasks: ApiTaskShape[]): number;
export declare function buildRecentActivity(tasks: ApiTaskShape[], limit?: number): ActivityLogShape[];
export declare function sortTasks(tasks: ApiTaskShape[], sort: "dueDate" | "priority" | "status" | "createdAt"): ApiTaskShape[];
export declare function filterTasksList(tasks: ApiTaskShape[], query: {
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
}): ApiTaskShape[];
//# sourceMappingURL=dashboardUtils.d.ts.map