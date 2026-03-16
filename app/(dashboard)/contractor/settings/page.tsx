"use client"

import { useState } from "react"
import { User, Bell, Shield, Briefcase, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "business", name: "Business Profile", icon: Briefcase },
  { id: "services", name: "Services & Area", icon: MapPin },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
]

const services = [
  "Plumbing repairs",
  "Pipe installation",
  "Water heater service",
  "Drain cleaning",
  "Fixture installation",
  "Emergency repairs",
]

export default function ContractorSettingsPage() {
  const [activeTab, setActiveTab] = useState("business")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your business profile and preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="flex gap-2 lg:flex-col lg:w-52">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Business information</CardTitle>
                <CardDescription>Update your business profile shown to homeowners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">MP</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Upload logo</Button>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 400x400px</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="businessName" className="text-sm font-medium">Business name</label>
                  <Input id="businessName" defaultValue="Mike's Plumbing" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">About your business</label>
                  <textarea
                    id="bio"
                    className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="Licensed and insured plumber with over 15 years of experience serving the Austin metro area. Specializing in residential repairs and installations."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Business phone</label>
                    <Input id="phone" type="tel" defaultValue="(512) 555-0199" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Business email</label>
                    <Input id="email" type="email" defaultValue="mike@mikesplumbing.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="license" className="text-sm font-medium">License number</label>
                  <Input id="license" defaultValue="TX-PLB-123456" />
                </div>

                <Button>Save changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Services & coverage area</CardTitle>
                <CardDescription>Define what you do and where you work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Services offered</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service) => (
                      <Badge key={service} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {service}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">+ Add service</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="serviceRadius" className="text-sm font-medium">Service radius (miles)</label>
                  <Input id="serviceRadius" type="number" defaultValue="25" className="max-w-32" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="baseLocation" className="text-sm font-medium">Base location</label>
                  <Input id="baseLocation" defaultValue="Austin, TX 78701" />
                </div>

                <Button>Save changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about new jobs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "New job matches", description: "Get notified when new jobs match your services" },
                  { title: "Messages", description: "Receive alerts for new messages from homeowners" },
                  { title: "Urgent jobs", description: "Immediate alerts for emergency requests" },
                  { title: "Payment received", description: "Confirmation when payments are processed" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security settings</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">Current password</label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm new password</label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update password</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
