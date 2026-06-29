import { addDays, endOfDay, format, isToday, isTomorrow, isWithinInterval, parseISO, startOfDay, subMonths, } from "date-fns";
const STATUS_LABEL = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    TESTING: "Testing",
    DONE: "Done",
};
const STATUS_COLORS = {
    OPEN: "oklch(0.72 0.02 270)",
    IN_PROGRESS: "oklch(0.52 0.22 280)",
    TESTING: "oklch(0.78 0.16 75)",
    DONE: "oklch(0.66 0.16 155)",
};
function isOverdue(iso) {
    const due = parseISO(iso);
    const now = new Date();
    return due < startOfDay(now) && !isToday(due);
}
export function filterTasksByPeriod(tasks, period) {
    if (period === "all")
        return tasks;
    const now = new Date();
    const end = period === "today"
        ? endOfDay(now)
        : period === "week"
            ? endOfDay(addDays(now, 7))
            : endOfDay(addDays(now, 30));
    return tasks.filter((t) => {
        const due = parseISO(t.dueDate);
        if (period === "today") {
            return isToday(due) || (t.status !== "DONE" && isOverdue(t.dueDate));
        }
        return isWithinInterval(due, { start: startOfDay(now), end });
    });
}
export function filterMyTasks(tasks, userId, focus) {
    const mine = tasks.filter((t) => t.assignedTo === userId && t.status !== "DONE");
    if (focus === "today") {
        return mine
            .filter((t) => isToday(parseISO(t.dueDate)) || isOverdue(t.dueDate))
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    return mine
        .filter((t) => {
        const due = parseISO(t.dueDate);
        return isTomorrow(due) || (!isToday(due) && !isOverdue(t.dueDate));
    })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 6);
}
export function computeSummary(tasks, currentUserId) {
    return {
        totalTasks: tasks.length,
        openTasks: tasks.filter((t) => t.status === "OPEN").length,
        inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        testingTasks: tasks.filter((t) => t.status === "TESTING").length,
        doneTasks: tasks.filter((t) => t.status === "DONE").length,
        overdueTasks: tasks.filter((t) => t.status !== "DONE" && isOverdue(t.dueDate)).length,
        assignedToMe: currentUserId ? tasks.filter((t) => t.assignedTo === currentUserId).length : 0,
        highPriorityTasks: tasks.filter((t) => t.priority === "HIGH").length,
    };
}
export function getStatusChartData(tasks) {
    const statuses = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];
    return statuses.map((status) => ({
        status,
        label: STATUS_LABEL[status],
        value: tasks.filter((t) => t.status === status).length,
        fill: STATUS_COLORS[status],
    }));
}
export function getTasksTrendData(tasks) {
    const months = Array.from({ length: 7 }, (_, i) => subMonths(new Date(), 6 - i));
    return months.map((month) => {
        const key = format(month, "yyyy-MM");
        const label = format(month, "MMM");
        const created = tasks.filter((t) => format(parseISO(t.createdAt), "yyyy-MM") === key).length;
        const completed = tasks.filter((t) => t.status === "DONE" && format(parseISO(t.updatedAt), "yyyy-MM") === key).length;
        return { label, created, completed };
    });
}
export function getStatusPipeline(tasks) {
    const total = tasks.length || 1;
    const statuses = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];
    return statuses.map((status) => {
        const count = tasks.filter((t) => t.status === status).length;
        return {
            status,
            label: STATUS_LABEL[status],
            count,
            percent: Math.round((count / total) * 100),
            color: STATUS_COLORS[status],
        };
    });
}
export function getDueSoonTasks(tasks, limit = 4) {
    return [...tasks]
        .filter((t) => t.status !== "DONE")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, limit);
}
export function getUrgentTasks(tasks, limit = 4) {
    return [...tasks]
        .filter((t) => t.status !== "DONE" && (t.priority === "HIGH" || isOverdue(t.dueDate)))
        .sort((a, b) => {
        const aScore = (a.priority === "HIGH" ? 2 : 0) + (isOverdue(a.dueDate) ? 3 : 0);
        const bScore = (b.priority === "HIGH" ? 2 : 0) + (isOverdue(b.dueDate) ? 3 : 0);
        return bScore - aScore || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
        .slice(0, limit);
}
export function getCompletionRate(tasks) {
    if (!tasks.length)
        return 0;
    return Math.round((tasks.filter((t) => t.status === "DONE").length / tasks.length) * 100);
}
export function buildRecentActivity(tasks, limit = 5) {
    return [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit)
        .map((t) => {
        const createdMs = new Date(t.createdAt).getTime();
        const updatedMs = new Date(t.updatedAt).getTime();
        const isNew = Math.abs(updatedMs - createdMs) < 5000;
        const type = isNew ? "TASK_CREATED" : t.status === "DONE" ? "STATUS_CHANGED" : "TASK_UPDATED";
        const message = isNew
            ? `Created task "${t.title}"`
            : t.status === "DONE"
                ? `Completed "${t.title}"`
                : `Updated "${t.title}"`;
        return {
            id: `act-${t.id}-${t.updatedAt}`,
            type,
            message,
            taskId: t.id,
            userId: t.createdBy,
            createdAt: t.updatedAt,
        };
    });
}
export function sortTasks(tasks, sort) {
    const PRIORITY_RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const STATUS_RANK = { OPEN: 0, IN_PROGRESS: 1, TESTING: 2, DONE: 3 };
    return [...tasks].sort((a, b) => {
        switch (sort) {
            case "dueDate":
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case "createdAt":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "priority":
                return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
            case "status":
                return STATUS_RANK[a.status] - STATUS_RANK[b.status];
        }
    });
}
export function filterTasksList(tasks, query) {
    let list = tasks;
    if (query.search?.trim()) {
        const q = query.search.toLowerCase();
        list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (query.status && query.status !== "ALL") {
        list = list.filter((t) => t.status === query.status);
    }
    if (query.priority && query.priority !== "ALL") {
        list = list.filter((t) => t.priority === query.priority);
    }
    if (query.assignedTo && query.assignedTo !== "ALL") {
        list = list.filter((t) => t.assignedTo === query.assignedTo);
    }
    return list;
}
//# sourceMappingURL=dashboardUtils.js.map