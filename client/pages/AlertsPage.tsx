import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Wind,
  Waves,
  Activity,
  Users,
  TrendingUp,
  MoreVertical,
  Download,
  Share2,
  Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["active-alerts"],
    queryFn: () => fetch("/api/alerts").then((res) => res.json()),
  });

  const filteredAlerts = alerts?.filter((alert) => {
    const matchesSearch =
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      !filterSeverity || alert.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleDispatch = (alert: Alert) => {
    toast.success(`Emergency services dispatched to ${alert.location}`, {
      description: `Units are en route for ${alert.type} response.`,
    });
  };

  const handleAcknowledge = (alert: Alert) => {
    toast.info(`Alert acknowledged: ${alert.id}`, {
      description: "Government response team has been notified.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Alert Management
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring and response coordination.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
          <Button className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Issue Manual Alert
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location or disaster type..."
            className="pl-10 bg-card/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["Emergency", "Warning", "Watch"].map((severity) => (
            <Button
              key={severity}
              variant={filterSeverity === severity ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setFilterSeverity(filterSeverity === severity ? null : severity)
              }
              className={cn(
                "h-9 px-4",
                filterSeverity === severity &&
                  severity === "Emergency" &&
                  "bg-emergency hover:bg-emergency/90",
                filterSeverity === severity &&
                  severity === "Warning" &&
                  "bg-warning hover:bg-warning/90",
              )}
            >
              {severity}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAlerts?.length === 0 ? (
            <Card className="bg-card/50 border-dashed border-2 flex flex-col items-center justify-center py-20 text-center">
              <CheckCircle2 className="h-12 w-12 text-safe mb-4 opacity-20" />
              <h3 className="text-lg font-semibold">No active alerts found</h3>
              <p className="text-muted-foreground max-w-xs">
                Try adjusting your filters or search query.
              </p>
            </Card>
          ) : (
            filteredAlerts?.map((alert) => (
              <Card
                key={alert.id}
                className={cn(
                  "bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer group",
                  selectedAlert?.id === alert.id &&
                    "border-primary ring-1 ring-primary/20",
                )}
                onClick={() => setSelectedAlert(alert)}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div
                      className={cn(
                        "w-1.5 shrink-0",
                        alert.severity === "Emergency"
                          ? "bg-emergency"
                          : alert.severity === "Warning"
                            ? "bg-warning"
                            : "bg-blue-400",
                      )}
                    />
                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg bg-background border border-border",
                              alert.severity === "Emergency"
                                ? "text-emergency"
                                : alert.severity === "Warning"
                                  ? "text-warning"
                                  : "text-blue-400",
                            )}
                          >
                            {alert.type === "Cyclone" ? (
                              <Wind className="h-5 w-5" />
                            ) : alert.type === "Flash Flood" ? (
                              <Waves className="h-5 w-5" />
                            ) : (
                              <Activity className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">
                                {alert.type}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] h-5",
                                  alert.severity === "Emergency"
                                    ? "border-emergency text-emergency"
                                    : alert.severity === "Warning"
                                      ? "border-warning text-warning"
                                      : "border-blue-400 text-blue-400",
                                )}
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {alert.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <Badge
                            variant="secondary"
                            className="mt-2 text-[10px]"
                          >
                            {alert.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">
                              {alert.affectedPopulation.toLocaleString()} at
                              risk
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium">
                              {Math.round(alert.confidence * 100)}% AI
                              Confidence
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail View / Actions */}
        <div className="space-y-6">
          {selectedAlert ? (
            <Card className="bg-card/50 border-border sticky top-24">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Alert Details</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Share2 className="h-4 w-4" /> Share Alert
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-emergency">
                        <AlertTriangle className="h-4 w-4" /> Escalate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>ID: {selectedAlert.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recommended Actions
                  </h4>
                  <div className="space-y-2">
                    {selectedAlert.recommendedActions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-xs leading-normal">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAcknowledge(selectedAlert)}
                  >
                    Acknowledge
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-emergency hover:bg-emergency/90">
                        Dispatch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Emergency Dispatch</DialogTitle>
                        <DialogDescription>
                          This will notify all emergency response units in the{" "}
                          {selectedAlert.location} area.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                          <p className="text-sm font-bold mb-1">
                            Target Location
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedAlert.location}
                          </p>
                        </div>
                        <div className="p-4 bg-emergency/10 rounded-lg border border-emergency/20">
                          <p className="text-sm font-bold text-emergency mb-1">
                            Alert Type
                          </p>
                          <p className="text-xs text-emergency/80">
                            {selectedAlert.type} - {selectedAlert.severity}{" "}
                            Level
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          className="bg-emergency hover:bg-emergency/90"
                          onClick={() => handleDispatch(selectedAlert)}
                        >
                          Confirm Dispatch
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border border-dashed py-12 text-center">
              <CardContent>
                <Info className="h-8 w-8 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground">
                  Select an alert from the list to view details and take action.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Response Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Avg. Response Time
                </span>
                <span className="text-xs font-bold">12.4 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Units Deployed
                </span>
                <span className="text-xs font-bold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Resolution Rate
                </span>
                <span className="text-xs font-bold text-safe">94.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
