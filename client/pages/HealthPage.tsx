import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  Wifi, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Search
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SystemHealth } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function HealthPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: health, isLoading, refetch } = useQuery<SystemHealth>({
    queryKey: ["system-health"],
    queryFn: () => fetch("/api/health").then((res) => res.json()),
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  useEffect(() => {
    if (health) setLastUpdated(new Date());
  }, [health]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Real-time monitoring of ML pipelines and infrastructure.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-xs font-medium">{lastUpdated.toLocaleTimeString()}</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} className={cn(isLoading && "animate-spin")}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="bg-safe/10 text-safe border-safe/50 gap-1.5 py-1 px-3">
            <div className="h-2 w-2 rounded-full bg-safe animate-pulse" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-[10px]">v2.4.1</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">ML Inference</p>
            <h3 className="text-2xl font-bold mt-1">99.8%</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">GPU Utilization</span>
                <span>74%</span>
              </div>
              <Progress value={74} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-safe/10 rounded-lg">
                <Zap className="h-5 w-5 text-safe" />
              </div>
              <Badge variant="secondary" className="text-[10px]">Live</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Data Ingestion</p>
            <h3 className="text-2xl font-bold mt-1">{health?.ingestion.rate.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">msg/s</span></h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-safe">
              <CheckCircle2 className="h-3 w-3" />
              <span>Kafka Cluster Healthy</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Wifi className="h-5 w-5 text-warning" />
              </div>
              <Badge variant="secondary" className="text-[10px]">{health?.sensors.active}/{health?.sensors.total}</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Sensor Network</p>
            <h3 className="text-2xl font-bold mt-1">99.3%</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-warning">
              <AlertCircle className="h-3 w-3" />
              <span>2 sensors offline</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-[10px]">API</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Latency</p>
            <h3 className="text-2xl font-bold mt-1">{health?.api.latency} <span className="text-xs font-normal text-muted-foreground">ms</span></h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="text-safe">0.02%</span>
              </div>
              <Progress value={2} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Status */}
        <Card className="lg:col-span-2 bg-card/50 border-border">
          <CardHeader>
            <CardTitle>ML Model Registry</CardTitle>
            <CardDescription>Status and performance of active prediction models.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {health?.models.map((model, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      model.status === 'online' ? "bg-safe/10 text-safe" : "bg-emergency/10 text-emergency"
                    )}>
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{model.name}</p>
                      <p className="text-xs text-muted-foreground">Version: {model.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Latency</p>
                      <p className="text-sm font-medium">{model.latency}ms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", model.status === 'online' ? "bg-safe" : "bg-emergency")} />
                      <span className="text-xs font-medium capitalize">{model.status}</span>
                    </div>
                    <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="bg-card/50 border-border flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent incidents and events.</CardDescription>
            </div>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {health?.recentLogs.map((log) => (
                  <div key={log.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn(
                        "text-[8px] h-4 px-1.5",
                        log.level === 'error' ? "border-emergency text-emergency" :
                        log.level === 'warn' ? "border-warning text-warning" :
                        "border-primary text-primary"
                      )}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-mono bg-secondary/20 p-2 rounded border border-border/50">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 3 3 0 1 0 5.997-.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.52-8.105Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 1 0 12 5" />
      <path d="M12 19a3 3 0 1 0 5.997-.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.52-8.105 3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105Z" />
      <path d="M15 11a4.5 4.5 0 0 0-3 4" />
    </svg>
  )
}
