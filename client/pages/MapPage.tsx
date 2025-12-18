import React, { useState, useMemo } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  LayersControl, 
  LayerGroup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { 
  MapPin, 
  ShieldAlert, 
  Layers, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  Wind, 
  Waves, 
  Activity,
  X,
  Info,
  TrendingUp,
  Users,
  Clock,
  ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert, RiskScore } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (severity: string) => {
  const color = severity === "Emergency" ? "#ef4444" : severity === "Warning" ? "#f59e0b" : "#3b82f6";
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState<Alert | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    precipitation: true,
    seismic: false,
    population: false
  });

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["active-alerts"],
    queryFn: () => fetch("/api/alerts").then((res) => res.json()),
  });

  const { data: riskScores } = useQuery<RiskScore[]>({
    queryKey: ["risk-scores"],
    queryFn: () => fetch("/api/risk-scores").then((res) => res.json()),
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex relative overflow-hidden">
      {/* Main Map Area */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[44.5, -123.0]} 
          zoom={7} 
          style={{ height: "100%", width: "100%", background: "#020617" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Disaster Markers */}
          {!isLoading && alerts?.map((alert) => (
            <Marker 
              key={alert.id} 
              position={[alert.lat, alert.lng]}
              icon={createCustomIcon(alert.severity)}
              eventHandlers={{
                click: () => setSelectedRegion(alert),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <p className="font-bold text-sm">{alert.type}</p>
                  <p className="text-xs text-muted-foreground">{alert.location}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    {alert.severity}
                  </Badge>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Risk Zones (Circles) */}
          {riskScores?.map((score, idx) => (
            <Circle
              key={idx}
              center={[score.lat || 0, score.lng || 0]}
              radius={20000}
              pathOptions={{
                fillColor: score.score > 70 ? '#ef4444' : score.score > 40 ? '#f59e0b' : '#3b82f6',
                fillOpacity: 0.2,
                color: 'transparent'
              }}
            />
          ))}

          {/* Layer Overlays (Simulated with Circle/Rectangles if needed, but TileLayers are better) */}
          {activeLayers.precipitation && (
             <TileLayer
                url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                opacity={0.4}
             />
          )}
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-[1000]">
          <Card className="bg-card/90 backdrop-blur border-border shadow-2xl p-1">
            <div className="flex flex-col gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
              <Separator className="my-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8"><Navigation className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>

        {/* Layer Toggles Overlay */}
        <div className="absolute top-6 left-6 z-[1000] w-64 space-y-4">
          <Card className="bg-card/90 backdrop-blur border-border shadow-2xl">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {[
                { id: 'precipitation', label: 'Precipitation Heatmap', icon: Wind },
                { id: 'seismic', label: 'Seismic Fault Lines', icon: Activity },
                { id: 'population', label: 'Population Density', icon: Users }
              ].map((layer) => (
                <div key={layer.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-2">
                    <layer.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{layer.label}</span>
                  </div>
                  <button 
                    onClick={() => setActiveLayers(prev => ({ ...prev, [layer.id]: !prev[layer.id as keyof typeof prev] }))}
                    className={cn(
                      "h-4 w-8 rounded-full relative transition-colors",
                      activeLayers[layer.id as keyof typeof activeLayers] ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-2 w-2 bg-white rounded-full transition-all",
                      activeLayers[layer.id as keyof typeof activeLayers] ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000]">
          <Card className="bg-card/90 backdrop-blur border-border rounded-xl p-4 shadow-2xl w-64">
            <h4 className="text-xs font-bold mb-3 uppercase tracking-wider opacity-70">Risk Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emergency shadow-[0_0_8px_#ef4444]" />
                <span className="text-xs">Emergency (Immediate Action)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-warning shadow-[0_0_8px_#f59e0b]" />
                <span className="text-xs">Warning (High Probability)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                <span className="text-xs">Watch (Monitoring)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Side Panel for Selected Region */}
      <div className={cn(
        "w-96 border-l border-border bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-10 flex flex-col",
        selectedRegion ? "translate-x-0" : "translate-x-full absolute right-0 h-full"
      )}>
        {selectedRegion && (
          <>
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <Badge className={cn(
                  "mb-2",
                  selectedRegion.severity === "Emergency" ? "bg-emergency/20 text-emergency border-emergency/50" :
                  selectedRegion.severity === "Warning" ? "bg-warning/20 text-warning border-warning/50" :
                  "bg-blue-400/20 text-blue-400 border-blue-400/50"
                )}>
                  {selectedRegion.severity}
                </Badge>
                <h2 className="text-xl font-bold">{selectedRegion.location}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRegion(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Disaster Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-1">Type</p>
                      <div className="flex items-center gap-2">
                        {selectedRegion.type === "Cyclone" ? <Wind className="h-4 w-4" /> : 
                         selectedRegion.type === "Flash Flood" ? <Waves className="h-4 w-4" /> : 
                         <Activity className="h-4 w-4" />}
                        <span className="text-sm font-medium">{selectedRegion.type}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-1">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{Math.round(selectedRegion.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </section>

                <Separator />

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Impact Analysis</h3>
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Affected Population</p>
                      <p className="text-lg font-bold">{selectedRegion.affectedPopulation.toLocaleString()}</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recommended Actions</h3>
                  <div className="space-y-2">
                    {selectedRegion.recommendedActions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-xs leading-normal">{action}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h3>
                  <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                      <p className="text-xs font-bold">Alert Issued</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(selectedRegion.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                      <p className="text-xs font-bold">Model Update Expected</p>
                      <p className="text-[10px] text-muted-foreground">In 45 minutes</p>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border bg-secondary/10">
              <Button className="w-full gap-2" size="lg">
                <ShieldAlert className="h-4 w-4" />
                Dispatch Emergency Services
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
