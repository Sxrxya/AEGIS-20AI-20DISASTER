export interface RiskScore {
  region: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  disasterType: string;
  confidence: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'Watch' | 'Warning' | 'Emergency';
  location: string;
  timestamp: string;
  confidence: number;
  description: string;
}

export interface DashboardStats {
  activeAlerts: number;
  avgRiskScore: number;
  sensorsOnline: number;
  populationAtRisk: number;
}

export interface DemoResponse {
  message: string;
}
