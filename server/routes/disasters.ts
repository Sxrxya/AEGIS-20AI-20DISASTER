import { RequestHandler } from "express";
import { Alert, DashboardStats, RiskScore } from "@shared/api";

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
      description: "Category 4 Cyclone approaching North Coast. Immediate evacuation recommended."
    },
    {
      id: "2",
      type: "Flash Flood",
      severity: "Warning",
      location: "Central Valley",
      timestamp: new Date().toISOString(),
      confidence: 0.88,
      description: "Heavy rainfall causing rapid river level rise in Central Valley."
    }
  ];
  res.json(alerts);
};

export const getRiskScores: RequestHandler = (req, res) => {
  const scores: RiskScore[] = [
    { region: "North Coast", score: 85, trend: 'up', disasterType: "Cyclone", confidence: 0.94 },
    { region: "Central Valley", score: 40, trend: 'stable', disasterType: "Flood", confidence: 0.82 },
    { region: "South Ridge", score: 65, trend: 'up', disasterType: "Landslide", confidence: 0.75 }
  ];
  res.json(scores);
};
