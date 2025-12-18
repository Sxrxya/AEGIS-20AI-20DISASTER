import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleSignup } from "./routes/auth";
import {
  getDashboardStats,
  getActiveAlerts,
  getRiskScores,
  getAnalytics,
  getSystemHealth,
  getUserSettings
} from "./routes/disasters";

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

  // Auth API
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/signup", handleSignup);

  // Disaster Platform API
  app.get("/api/stats", getDashboardStats);
  app.get("/api/alerts", getActiveAlerts);
  app.get("/api/risk-scores", getRiskScores);
  app.get("/api/analytics", getAnalytics);
  app.get("/api/health", getSystemHealth);
  app.get("/api/settings", getUserSettings);

  return app;
}
