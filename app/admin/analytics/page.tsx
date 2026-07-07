'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    errorRate: 0,
    systemHealth: 'Healthy'
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const userGrowthData = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1900 },
    { month: 'Mar', users: 2800 },
    { month: 'Apr', users: 3900 },
    { month: 'May', users: 5100 },
    { month: 'Jun', users: 6200 }
  ]

  const revenueData = [
    { name: 'Machinery', value: 45, fill: '#10b981' },
    { name: 'Marketplace', value: 35, fill: '#f59e0b' },
    { name: 'AI Services', value: 15, fill: '#06b6d4' },
    { name: 'Subscriptions', value: 5, fill: '#ec4899' }
  ]

  const apiPerformance = [
    { endpoint: '/api/ai/analyze', avg: 245, p95: 580, p99: 890 },
    { endpoint: '/api/machinery/bookings', avg: 120, p95: 280, p99: 450 },
    { endpoint: '/api/marketplace/products', avg: 95, p95: 200, p99: 350 },
    { endpoint: '/api/enterprise/fleet', avg: 310, p95: 650, p99: 950 }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">System Analytics</h1>
          <p className="text-slate-400 mt-2">Monitor platform performance, users, and revenue</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-2">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-slate-400 mt-2">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                {stats.systemHealth === 'Healthy' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.systemHealth}</div>
              <p className="text-xs text-slate-400 mt-2">Error rate: {stats.errorRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly active users trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="users" stroke="#10b981" dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Distribution */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
              <CardDescription>By service category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={revenueData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} dataKey="value">
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* API Performance */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>API Performance (ms)</CardTitle>
            <CardDescription>Response time metrics by endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-300">Endpoint</th>
                    <th className="text-right py-3 px-4 text-slate-300">Avg (ms)</th>
                    <th className="text-right py-3 px-4 text-slate-300">P95 (ms)</th>
                    <th className="text-right py-3 px-4 text-slate-300">P99 (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {apiPerformance.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-300">{row.endpoint}</td>
                      <td className="text-right py-3 px-4 text-emerald-400 font-semibold">{row.avg}</td>
                      <td className="text-right py-3 px-4 text-amber-400 font-semibold">{row.p95}</td>
                      <td className="text-right py-3 px-4 text-red-400 font-semibold">{row.p99}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Events Log */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Recent System Events</CardTitle>
            <CardDescription>Last 10 significant events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 mins ago', event: 'User registration spike', status: 'info', icon: Users },
                { time: '15 mins ago', event: 'Database backup completed', status: 'success', icon: CheckCircle },
                { time: '1 hour ago', event: 'API latency spike detected', status: 'warning', icon: AlertCircle },
                { time: '3 hours ago', event: 'Fleet tracking sync', status: 'success', icon: CheckCircle },
                { time: '5 hours ago', event: 'AI model updated', status: 'info', icon: TrendingUp },
              ].map((event, idx) => {
                const IconComponent = event.icon
                const statusColors = {
                  info: 'text-cyan-400 bg-cyan-500/10',
                  success: 'text-emerald-400 bg-emerald-500/10',
                  warning: 'text-amber-400 bg-amber-500/10',
                }
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className={`p-2 rounded-lg ${statusColors[event.status as keyof typeof statusColors]}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{event.event}</div>
                      <div className="text-xs text-slate-400">{event.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
