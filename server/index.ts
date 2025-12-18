import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getDashboardStats, getActiveAlerts, getRiskScores } from "./routes/disasters";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Disaster Platform API
  app.get("/api/stats", getDashboardStats);
  app.get("/api/alerts", getActiveAlerts);
  app.get("/api/risk-scores", getRiskScores);

  return app;
}
