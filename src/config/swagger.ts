import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const routesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../routes");

function routeGlob(extension: "ts" | "js"): string {
  return path.join(routesDir, `*.${extension}`).replace(/\\/g, "/");
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FlowPilot API",
      version: "1.0.0",
      description:
        "REST API for FlowPilot task management. All responses use a uniform envelope: `{ success, message, data, errors? }`.",
    },
    servers: [
      {
        url: `${env.API_BASE_URL}/api`,
        description: env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { nullable: true },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            avatarUrl: { type: "string" },
            jobTitle: { type: "string" },
            department: { type: "string" },
            preferences: { $ref: "#/components/schemas/UserPreferences" },
          },
        },
        UserPreferences: {
          type: "object",
          properties: {
            sidebarOpen: { type: "boolean", default: true },
            tableView: { type: "string", enum: ["table", "card"], default: "table" },
            theme: { type: "string", enum: ["light", "dark"], default: "light" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/AuthUser" },
            token: { type: "string" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
            status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "TESTING", "DONE"] },
            dueDate: { type: "string", format: "date-time" },
            createdBy: { type: "string" },
            assignedTo: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        DashboardSummary: {
          type: "object",
          properties: {
            totalTasks: { type: "integer" },
            openTasks: { type: "integer" },
            inProgressTasks: { type: "integer" },
            testingTasks: { type: "integer" },
            doneTasks: { type: "integer" },
            overdueTasks: { type: "integer" },
            assignedToMe: { type: "integer" },
            highPriorityTasks: { type: "integer" },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            message: { type: "string" },
            taskId: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        DashboardData: {
          type: "object",
          properties: {
            summary: { $ref: "#/components/schemas/DashboardSummary" },
            completionRate: { type: "number" },
            statusChart: { type: "array", items: { type: "object" } },
            trend: { type: "array", items: { type: "object" } },
            pipeline: { type: "array", items: { type: "object" } },
            myTasks: { type: "array", items: { $ref: "#/components/schemas/Task" } },
            dueSoon: { type: "array", items: { $ref: "#/components/schemas/Task" } },
            urgent: { type: "array", items: { $ref: "#/components/schemas/Task" } },
            recentActivity: { type: "array", items: { $ref: "#/components/schemas/ActivityLog" } },
            period: { type: "string", enum: ["today", "week", "month", "all"] },
            taskFocus: { type: "string", enum: ["today", "upcoming"] },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            avatarUrl: { type: "string" },
            jobTitle: { type: "string" },
            department: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: [routeGlob("ts"), routeGlob("js")],
};

export const swaggerSpec = swaggerJsdoc(options);
