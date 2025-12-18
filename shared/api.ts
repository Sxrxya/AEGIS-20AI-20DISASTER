export interface RiskScore {
  region: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  disasterType: string;
  confidence: number;
  lat?: number;
  lng?: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'Watch' | 'Warning' | 'Emergency';
  location: string;
  timestamp: string;
  confidence: number;
  description: string;
  affectedPopulation: number;
  recommendedActions: string[];
  status: 'Active' | 'Resolved' | 'Acknowledged';
  lat: number;
  lng: number;
}

export interface DashboardStats {
  activeAlerts: number;
  avgRiskScore: number;
  sensorsOnline: number;
  populationAtRisk: number;
}

export interface AnalyticsData {
  frequency: { date: string; count: number }[];
  accuracy: { model: string; score: number }[];
  trends: { time: string; risk: number }[];
}

export interface SystemHealth {
  models: { name: string; status: 'online' | 'offline'; version: string; latency: number }[];
  ingestion: { status: 'online' | 'degraded' | 'offline'; rate: number };
  sensors: { total: number; active: number; incidents: number };
  api: { latency: number; errorRate: number };
  recentLogs: { id: string; timestamp: string; level: 'info' | 'warn' | 'error'; message: string }[];
}

export interface UserSettings {
  notifications: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  thresholds: {
    cyclone: number;
    flood: number;
    seismic: number;
    landslide: number;
  };
  subscriptions: string[];
  role: 'GOV' | 'PUBLIC' | 'EMERGENCY';
}

export interface DemoResponse {
  message: string;
}
