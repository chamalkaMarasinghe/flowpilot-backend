import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Express } from "express";
import { createApp } from "../src/createApp.js";
import { connectDb } from "../src/config/db.js";

let app: Express | undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      await connectDb();
      app = createApp();
    }

    return app(req, res);
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      success: false,
      message: "Service unavailable",
      data: null,
    });
  }
}
