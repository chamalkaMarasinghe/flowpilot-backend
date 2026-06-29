import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { helmetMiddleware } from "./middleware/helmetMiddleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/response.js";
import apiRoutes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmetMiddleware);
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    sendSuccess(res, { ok: true }, "Service healthy");
  });

  app.get("/", (_req, res) => {
    sendSuccess(
      res,
      {
        name: "FlowPilot API",
        version: "1.0.0",
        docs: `${env.API_BASE_URL}/api/docs`,
        health: `${env.API_BASE_URL}/health`,
        api: `${env.API_BASE_URL}/api`,
      },
      "FlowPilot API",
    );
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
