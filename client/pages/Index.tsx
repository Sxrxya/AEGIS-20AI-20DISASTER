import React from "react";
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MapPin,
  Map as MapIcon,
  ShieldAlert,
  Wind,
  Droplets,
  Waves
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats, Alert, RiskScore } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const riskData = [
  { time: "00:00", risk: 30 },
  { time: "04:00", risk: 35 },
  { time: "08:00", risk: 45 },
  { time: "12:00", risk: 60 },
  { time: "16:00", risk: 55 },
  { time: "20:00", risk: 70 },
  { time: "23:59", risk: 65 },
];

const regionalRisk = [
  { region: "North Coast", risk: 85, type: "Cyclone" },
  { region: "Central Valley", risk: 40, type: "Flood" },
  { region: "South Ridge", risk: 65, type: "Landslide" },
  { region: "East Plains", risk: 20, type: "Drought" },
  { region: "West Metro", risk: 15, type: "Seismic" },
];

const activeAlerts = [
  {
    id: 1,
    type: "Cyclone",
    severity: "Emergency",
    location: "North Coast Region",
    time: "12 mins ago",
    confidence: "94%",
    icon: Wind,
    color: "text-emergency"
  },
  {
    id: 2,
    type: "Flash Flood",
    severity: "Warning",
    location: "Central Valley",
    time: "45 mins ago",
    confidence: "88%",
    icon: Waves,
    color: "text-warning"
  },
  {
    id: 3,
    type: "Seismic Activity",
    severity: "Watch",
    location: "South Ridge Fault",
    time: "2 hours ago",
    confidence: "72%",
    icon: Activity,
    color: "text-blue-400"
  }
];

export default function Index() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ["active-alerts"],
    queryFn: () => fetch("/api/alerts").then((res) => res.json()),
  });

  const { data: riskScores, isLoading: riskScoresLoading } = useQuery<RiskScore[]>({
    queryKey: ["risk-scores"],
    queryFn: () => fetch("/api/risk-scores").then((res) => res.json()),
  });

  const isLoading = statsLoading || alertsLoading || riskScoresLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">National Risk Dashboard</h1>
          <p className="text-muted-foreground">Real-time AI-driven disaster prediction and monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                AI
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">12 Agents</span> monitoring streams
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <h3 className="text-2xl font-bold mt-1">
                  {statsLoading ? "..." : String(stats?.activeAlerts).padStart(2, '0')}
                </h3>
              </div>
              <div className="p-2 bg-emergency/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-emergency" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs text-emergency">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+2 since last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Risk Score</p>
                <h3 className="text-2xl font-bold mt-1">
                  {statsLoading ? "..." : stats?.avgRiskScore}
                </h3>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs text-warning">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+5.2% trend</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sensors Online</p>
                <h3 className="text-2xl font-bold mt-1">
                  {statsLoading ? "..." : stats?.sensorsOnline.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-safe/10 rounded-lg">
                <Activity className="h-5 w-5 text-safe" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs text-safe">
              <ShieldAlert className="h-3 w-3 mr-1" />
              <span>99.9% Uptime</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Population at Risk</p>
                <h3 className="text-2xl font-bold mt-1">
                  {statsLoading ? "..." : `${(stats?.populationAtRisk || 0) / 1000000}M`}
                </h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-120k evacuated</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Timeline */}
        <Card className="lg:col-span-2 bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Risk Probability Timeline</CardTitle>
            <CardDescription>24-hour aggregate risk forecast across all disaster types.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    itemStyle={{ color: "hsl(var(--primary))" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts List */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>Live emergency dispatches.</CardDescription>
            </div>
            <Badge variant="outline" className="animate-pulse border-emergency text-emergency">LIVE</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              alerts?.map((alert) => {
                const Icon = alert.type === "Cyclone" ? Wind : alert.type === "Flash Flood" ? Waves : Activity;
                const color = alert.severity === "Emergency" ? "text-emergency" : alert.severity === "Warning" ? "text-warning" : "text-blue-400";

                return (
                  <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className={cn("p-2 rounded-full bg-background", color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold truncate">{alert.type}</p>
                        <span className="text-[10px] text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {alert.severity}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          AI Confidence: <span className="text-foreground font-medium">{Math.round(alert.confidence * 100)}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <Button variant="outline" className="w-full text-xs">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Risk Breakdown */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Regional Risk Analysis</CardTitle>
            <CardDescription>Probability by geographic zone.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {riskScoresLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskScores} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="region"
                      type="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {riskScores?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.score > 70 ? 'hsl(var(--emergency))' : entry.score > 40 ? 'hsl(var(--warning))' : 'hsl(var(--primary))'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Map Simulation */}
        <Card className="lg:col-span-2 bg-card/50 border-border overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20 grayscale group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <CardHeader className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Live Geospatial Heatmap</CardTitle>
                <CardDescription>Real-time sensor overlay and risk zones.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emergency/20 text-emergency border-emergency/50">High Risk Zone</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/50">1,240 Sensors</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 h-[250px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-emergency/20 rounded-full animate-ping" />
                <div className="relative bg-emergency p-4 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold">North Coast Region</p>
                <p className="text-sm text-muted-foreground">Cyclone Path Prediction: Category 4</p>
              </div>
              <Button variant="secondary" size="sm" className="gap-2">
                <MapIcon className="h-4 w-4" />
                Open Full Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
