import React from "react";
import { MapPin, ShieldAlert, Layers, Navigation, ZoomIn, ZoomOut, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80" />

      {/* Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
        <Button size="icon" variant="secondary" className="shadow-lg"><ZoomIn className="h-4 w-4" /></Button>
        <Button size="icon" variant="secondary" className="shadow-lg"><ZoomOut className="h-4 w-4" /></Button>
        <div className="h-4" />
        <Button size="icon" variant="secondary" className="shadow-lg"><Layers className="h-4 w-4" /></Button>
        <Button size="icon" variant="secondary" className="shadow-lg"><Navigation className="h-4 w-4" /></Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="absolute top-6 left-6 z-10 w-80 space-y-4">
        <div className="bg-card/90 backdrop-blur border border-border rounded-xl p-2 shadow-2xl flex items-center gap-2">
          <div className="flex-1 px-3 py-2 text-sm text-muted-foreground">Search region or sensor...</div>
          <Button size="icon" variant="ghost"><Filter className="h-4 w-4" /></Button>
        </div>

        <Card className="bg-card/90 backdrop-blur border-border shadow-2xl">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Active Layers</h3>
              <Badge variant="outline" className="text-[10px]">3 Active</Badge>
            </div>
            <div className="space-y-2">
              {['Precipitation Heatmap', 'Seismic Fault Lines', 'Population Density'].map((layer) => (
                <div key={layer} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-xs">{layer}</span>
                  <div className="h-4 w-8 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 h-2 w-2 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Overlay Simulation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simulated Heatmap Blobs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emergency/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-warning/10 rounded-full blur-[100px]" />
        
        {/* Simulated Markers */}
        <div className="absolute top-[30%] left-[40%] pointer-events-auto group">
          <div className="relative">
            <div className="absolute -inset-4 bg-emergency/30 rounded-full animate-ping" />
            <MapPin className="h-8 w-8 text-emergency drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-card border border-border rounded-lg p-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs font-bold text-emergency">CRITICAL RISK</p>
              <p className="text-sm font-bold">North Coast Zone A</p>
              <p className="text-[10px] text-muted-foreground mt-1">Cyclone Path: 94% Confidence</p>
              <Button size="sm" className="w-full mt-2 h-7 text-[10px]">View Details</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
        <div className="bg-card/90 backdrop-blur border border-border rounded-xl p-4 shadow-2xl w-64">
          <h4 className="text-xs font-bold mb-3 uppercase tracking-wider opacity-70">Risk Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emergency" />
              <span className="text-xs">Emergency (Immediate Action)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-xs">Warning (High Probability)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-400" />
              <span className="text-xs">Watch (Monitoring)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="shadow-lg gap-2">
            <ShieldAlert className="h-4 w-4 text-emergency" />
            Dispatch Emergency Services
          </Button>
        </div>
      </div>
    </div>
  );
}
