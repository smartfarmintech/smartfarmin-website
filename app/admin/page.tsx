"use client"

import { Suspense, useState } from "react"
import {
  Users,
  TrendingUp,
  ShoppingCart,
  FileText,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Platform management and analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Status: Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24,580</div>
                  <p className="text-xs text-muted-foreground">Sample Data • +2.1% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,240</div>
                  <p className="text-xs text-muted-foreground">Sample Data • In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹4.82 Cr</div>
                  <p className="text-xs text-muted-foreground">Sample Data • +18.4% YoY</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <p className="text-xs text-muted-foreground">Uptime • All systems optimal</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and user actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "New farmer registered", user: "Rajesh Kumar", time: "2 mins ago" },
                    { action: "Order completed", id: "#ORD-2024-001", time: "15 mins ago" },
                    { action: "Operator verified", name: "P. Sharma", time: "1 hour ago" },
                    { action: "Payment processed", amount: "₹5,000", time: "3 hours ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{("user" in item && item.user) || ("id" in item && item.id) || ("name" in item && item.name) || ("amount" in item && item.amount)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                  <CardDescription>Tasks requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: "Verification", count: 12, icon: CheckCircle2 },
                    { type: "Payment Disputes", count: 3, icon: AlertCircle },
                    { type: "Scheme Applications", count: 8, icon: FileText },
                    { type: "Support Tickets", count: 24, icon: AlertCircle },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{item.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add User</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-10" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Joined</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Rajesh Kumar", role: "Farmer", status: "Active", joined: "Jan 15, 2024" },
                        { name: "Priya Sharma", role: "Operator", status: "Active", joined: "Jan 12, 2024" },
                        { name: "Ahmad Ali", role: "Dealer", status: "Pending", joined: "Jan 20, 2024" },
                      ].map((user, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{user.role}</span></td>
                          <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span></td>
                          <td className="py-3 px-4">{user.joined}</td>
                          <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Operators Management</CardTitle>
                  <CardDescription>Active machinery rental operators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Ram Tractors", rating: 4.8, machines: 12, status: "Verified" },
                    { name: "Punjab Equipment", rating: 4.6, machines: 8, status: "Verified" },
                    { name: "Digital Farming Co", rating: 4.9, machines: 15, status: "Verified" },
                  ].map((op, i) => (
                    <div key={i} className="p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{op.name}</p>
                          <p className="text-xs text-muted-foreground">{op.machines} machines • {op.rating}⭐</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{op.status}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Farmers Data</CardTitle>
                  <CardDescription>Active farmer accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Avg Land Size", value: "4.2 acres", trend: "+2.1%" },
                    { name: "Top Crop", value: "Paddy Rice", trend: "62% farmers" },
                    { name: "Verified", value: "18,450", trend: "75% of total" },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">{stat.name}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.trend}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bookings Overview</CardTitle>
                <CardDescription>Sample Data • Machinery rental transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Active Bookings</p>
                    <p className="text-2xl font-bold">348</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last week</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Completed This Month</p>
                    <p className="text-2xl font-bold">1,240</p>
                    <p className="text-xs text-green-600 mt-1">97.3% fulfillment rate</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Avg Transaction Value</p>
                    <p className="text-2xl font-bold">₹3,450</p>
                    <p className="text-xs text-blue-600 mt-1">Sample Data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "API", status: "Operational" },
                    { name: "Database", status: "Operational" },
                    { name: "Cache", status: "Operational" },
                    { name: "Storage", status: "Operational" },
                  ].map((system, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{system.name}</span>
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    ✓ SSL/TLS Enabled
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    ✓ 2FA Active
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    ✓ Data Encrypted
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "Payment Gateway", status: "Connected" },
                    { name: "SMS Provider", status: "Connected" },
                    { name: "Email Service", status: "Connected" },
                  ].map((integration, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{integration.name}</span>
                      <span className="text-xs text-green-600">{integration.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>System actions and security events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { action: "User created", user: "admin@smartfarmin.com", time: "2024-01-20 14:30" },
                  { action: "Payment processed", id: "#ORD-2024-001", time: "2024-01-20 13:45" },
                  { action: "Farmer verified", email: "farmer@example.com", time: "2024-01-20 12:20" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{"user" in log ? log.user : "id" in log ? log.id : log.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
