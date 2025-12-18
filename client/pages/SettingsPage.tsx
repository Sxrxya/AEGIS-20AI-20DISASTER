import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  User,
  Globe,
  Lock,
  Save,
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronRight,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserSettings } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);

  React.useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated across all devices.",
    });
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Platform Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, notifications, and system thresholds.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-card/50 border border-border p-1">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="gap-2">
            <AlertTriangle className="h-4 w-4" /> Thresholds
          </TabsTrigger>
          <TabsTrigger value="regions" className="gap-2">
            <Globe className="h-4 w-4" /> Regions
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive emergency alerts and system
                updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    id: "sms",
                    label: "SMS Alerts",
                    desc: "Receive critical emergency alerts via text message.",
                    icon: MessageSquare,
                  },
                  {
                    id: "email",
                    label: "Email Notifications",
                    desc: "Daily summaries and non-critical system updates.",
                    icon: Mail,
                  },
                  {
                    id: "push",
                    label: "Push Notifications",
                    desc: "Real-time browser and mobile app alerts.",
                    icon: Smartphone,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-lg border border-border">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label
                          htmlFor={item.id}
                          className="text-sm font-bold cursor-pointer"
                        >
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={item.id}
                      checked={
                        localSettings.notifications[
                          item.id as keyof typeof localSettings.notifications
                        ]
                      }
                      onCheckedChange={(checked) =>
                        setLocalSettings({
                          ...localSettings,
                          notifications: {
                            ...localSettings.notifications,
                            [item.id]: checked,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thresholds Tab */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Alert Thresholds</CardTitle>
                  <CardDescription>
                    Set the AI confidence level required to trigger automated
                    alerts.
                  </CardDescription>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/50 gap-1.5">
                  <ShieldCheck className="h-3 w-3" />
                  GOV Admin Mode
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(localSettings.thresholds).map(([key, value]) => (
                <div key={key} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold capitalize">
                      {key} Prediction
                    </Label>
                    <Badge variant="secondary">{value}% Confidence</Badge>
                  </div>
                  <Slider
                    value={[value]}
                    max={100}
                    step={1}
                    onValueChange={([val]) =>
                      setLocalSettings({
                        ...localSettings,
                        thresholds: { ...localSettings.thresholds, [key]: val },
                      })
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Alerts will be automatically dispatched when the {key} model
                    reaches {value}% confidence.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Subscribed Regions</CardTitle>
              <CardDescription>
                Manage the geographic zones you are monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localSettings.subscriptions.map((region) => (
                  <div
                    key={region}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{region}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-emergency hover:text-emergency hover:bg-emergency/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="h-auto py-4 border-dashed border-2 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Region
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Manage your account security and role-based permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Current Role: {localSettings.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You have full administrative access to system-wide
                      settings.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Permissions
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    defaultValue="admin@aegis-disaster.gov"
                    className="bg-card/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-card/50"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  Update Security Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
