import type { RequestHandler } from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const helmet = require("helmet") as (options?: {
  contentSecurityPolicy?: boolean;
}) => RequestHandler;

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
});
