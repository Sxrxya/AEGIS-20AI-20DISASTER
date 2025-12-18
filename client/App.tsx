import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

// Placeholder components for other routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
      <div className="bg-secondary p-4 rounded-full mb-4">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Module Under Development</h2>
      <p className="text-muted-foreground max-w-md">
        This module is currently being integrated with the real-time data streaming layer.
        Please continue prompting to fill in this page's contents.
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/map" element={<PlaceholderPage title="Live Disaster Heatmap" />} />
            <Route path="/alerts" element={<PlaceholderPage title="Alert Management" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Historical Analytics" />} />
            <Route path="/health" element={<PlaceholderPage title="System Health & Sensor Monitoring" />} />
            <Route path="/settings" element={<PlaceholderPage title="Platform Settings" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
