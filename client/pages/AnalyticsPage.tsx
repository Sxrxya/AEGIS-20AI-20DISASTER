import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  BrainCircuit,
  ChevronDown,
  Clock,
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
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsData } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const accuracyData = [
  { name: "Cyclone", accuracy: 94, confidence: 88 },
  { name: "Flood", accuracy: 88, confidence: 82 },
  { name: "Seismic", accuracy: 72, confidence: 65 },
  { name: "Landslide", accuracy: 85, confidence: 78 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--emergency))",
  "hsl(var(--warning))",
  "hsl(var(--safe))",
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics", timeRange],
    queryFn: () => fetch("/api/analytics").then((res) => res.json()),
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historical Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into disaster patterns and model performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-card/50">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Events",
            value: "142",
            trend: "+12%",
            up: true,
            icon: Activity,
          },
          {
            label: "Avg. Prediction Lead",
            value: "4.2 Days",
            trend: "+0.5d",
            up: true,
            icon: Clock,
          },
          {
            label: "Model Accuracy",
            value: "92.4%",
            trend: "+2.1%",
            up: true,
            icon: Target,
          },
          {
            label: "False Positives",
            value: "1.2%",
            trend: "-0.4%",
            up: false,
            icon: BrainCircuit,
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-secondary rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center mt-4 text-xs",
                  stat.up ? "text-safe" : "text-emergency",
                )}
              >
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>{stat.trend} from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disaster Frequency */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Disaster Frequency Over Time</CardTitle>
            <CardDescription>
              Monthly aggregate of detected and predicted events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.frequency}>
                    <defs>
                      <linearGradient
                        id="colorFreq"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
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
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorFreq)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Model Accuracy Comparison */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Model Accuracy by Disaster Type</CardTitle>
            <CardDescription>
              Comparison of prediction accuracy vs. AI confidence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
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
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="accuracy"
                    name="Actual Accuracy"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="confidence"
                    name="Avg. Confidence"
                    fill="hsl(var(--muted))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>By severity level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Emergency", value: 15 },
                      { name: "Warning", value: 35 },
                      { name: "Watch", value: 50 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Accuracy Trend */}
        <Card className="lg:col-span-2 bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Prediction Accuracy Trend</CardTitle>
            <CardDescription>
              Model performance over the selected time range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
