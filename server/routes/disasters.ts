import { RequestHandler } from "express";
import { Alert, DashboardStats, RiskScore, AnalyticsData, SystemHealth, UserSettings } from "@shared/api";

export const getDashboardStats: RequestHandler = (req, res) => {
  const stats: DashboardStats = {
    activeAlerts: 8,
    avgRiskScore: 42.5,
    sensorsOnline: 1240,
    populationAtRisk: 2400000
  };
  res.json(stats);
};

export const getActiveAlerts: RequestHandler = (req, res) => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "Cyclone",
      severity: "Emergency",
      location: "North Coast Region",
      timestamp: new Date().toISOString(),
      confidence: 0.94,
      description: "Category 4 Cyclone approaching North Coast. Immediate evacuation recommended.",
      affectedPopulation: 450000,
      recommendedActions: ["Evacuate to higher ground", "Secure loose objects", "Stockpile 3 days of water"],
      status: "Active",
      lat: 45.523062,
      lng: -122.676482
    },
    {
      id: "2",
      type: "Flash Flood",
      severity: "Warning",
      location: "Central Valley",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      confidence: 0.88,
      description: "Heavy rainfall causing rapid river level rise in Central Valley.",
      affectedPopulation: 120000,
      recommendedActions: ["Avoid low-lying areas", "Do not drive through flood waters"],
      status: "Acknowledged",
      lat: 44.052069,
      lng: -123.086754
    },
    {
      id: "3",
      type: "Seismic Activity",
      severity: "Watch",
      location: "South Ridge Fault",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      confidence: 0.72,
      description: "Minor tremors detected. Potential for larger event within 24 hours.",
      affectedPopulation: 800000,
      recommendedActions: ["Review earthquake safety protocols", "Secure heavy furniture"],
      status: "Active",
      lat: 42.331427,
      lng: -122.875595
    }
  ];
  res.json(alerts);
};

export const getRiskScores: RequestHandler = (req, res) => {
  const scores: RiskScore[] = [
    { region: "North Coast", score: 85, trend: 'up', disasterType: "Cyclone", confidence: 0.94, lat: 45.5, lng: -122.6 },
    { region: "Central Valley", score: 40, trend: 'stable', disasterType: "Flood", confidence: 0.82, lat: 44.0, lng: -123.0 },
    { region: "South Ridge", score: 65, trend: 'up', disasterType: "Landslide", confidence: 0.75, lat: 42.3, lng: -122.8 }
  ];
  res.json(scores);
};

export const getAnalytics: RequestHandler = (req, res) => {
  const analytics: AnalyticsData = {
    frequency: [
      { date: "2024-01", count: 12 },
      { date: "2024-02", count: 15 },
      { date: "2024-03", count: 8 },
      { date: "2024-04", count: 22 },
      { date: "2024-05", count: 18 }
    ],
    accuracy: [
      { model: "LSTM-v4", score: 0.92 },
      { model: "Transformer-v2", score: 0.88 },
      { model: "Ensemble-v1", score: 0.95 }
    ],
    trends: [
      { time: "Mon", risk: 30 },
      { time: "Tue", risk: 45 },
      { time: "Wed", risk: 40 },
      { time: "Thu", risk: 60 },
      { time: "Fri", risk: 75 },
      { time: "Sat", risk: 65 },
      { time: "Sun", risk: 50 }
    ]
  };
  res.json(analytics);
};

export const getSystemHealth: RequestHandler = (req, res) => {
  const health: SystemHealth = {
    models: [
      { name: "Cyclone Predictor", status: "online", version: "v2.4.1", latency: 45 },
      { name: "Flood Forecaster", status: "online", version: "v1.8.0", latency: 32 },
      { name: "Seismic Analyzer", status: "online", version: "v3.0.2", latency: 120 }
    ],
    ingestion: { status: "online", rate: 12400 },
    sensors: { total: 1240, active: 1232, incidents: 2 },
    api: { latency: 18, errorRate: 0.02 },
    recentLogs: [
      { id: "1", timestamp: new Date().toISOString(), level: "info", message: "Model retraining completed for Cyclone Predictor." },
      { id: "2", timestamp: new Date(Date.now() - 60000).toISOString(), level: "warn", message: "Sensor #402 reporting intermittent connectivity." },
      { id: "3", timestamp: new Date(Date.now() - 120000).toISOString(), level: "error", message: "Failed to ingest satellite imagery from ESA source." }
    ]
  };
  res.json(health);
};

export const getUserSettings: RequestHandler = (req, res) => {
  const settings: UserSettings = {
    notifications: { sms: true, email: true, push: true },
    thresholds: { cyclone: 70, flood: 60, seismic: 50, landslide: 65 },
    subscriptions: ["North Coast", "Central Valley"],
    role: "GOV"
  };
  res.json(settings);
};
