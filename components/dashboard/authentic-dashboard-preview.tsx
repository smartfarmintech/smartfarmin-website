'use client'

import { TrendingUp, Users, Zap, Droplets, AlertCircle, CheckCircle2, Activity, MapPin } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const chartData = [
  { month: 'Jan', farmers: 2400, machinery: 1200, drones: 800 },
  { month: 'Feb', farmers: 2800, machinery: 1400, drones: 950 },
  { month: 'Mar', farmers: 3200, machinery: 1800, drones: 1200 },
  { month: 'Apr', farmers: 3800, machinery: 2200, drones: 1600 },
  { month: 'May', farmers: 4200, machinery: 2800, drones: 2100 },
  { month: 'Jun', farmers: 4800, machinery: 3200, drones: 2600 },
]

const cropsData = [
  { name: 'Rice', value: 35, color: '#10b981' },
  { name: 'Wheat', value: 28, color: '#34d399' },
  { name: 'Cotton', value: 22, color: '#f59e0b' },
  { name: 'Other', value: 15, color: '#94a3b8' },
]

const diseaseData = [
  { name: 'Detected', value: 342 },
  { name: 'Treated', value: 318 },
  { name: 'Prevented', value: 156 },
]

export function AuthenticDashboardPreview() {
  return (
    <div className="w-full bg-background rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-white">Rythu360 Enterprise Dashboard</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Live Updates</span>
            <span className="text-slate-600">|</span>
            <span>Last sync: 2 min ago</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glass p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Farmers</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">12,483</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 12% from last month
            </div>
          </div>

          <div className="card-glass p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Machinery</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,847</div>
            <div className="text-xs text-amber-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 8% utilization increase
            </div>
          </div>

          <div className="card-glass p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Drone Operations</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">542</div>
            <div className="text-xs text-cyan-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 24% this week
            </div>
          </div>

          <div className="card-glass p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Revenue (₹)</span>
              <Droplets className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">2.4Cr</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 18% MoM growth
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Growth Trend */}
          <div className="card-glass p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Growth Trend (6 Months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.2)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,255,255,0.2)" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="farmers" stroke="#10b981" fill="rgba(16,185,129,0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Detection */}
          <div className="card-glass p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Disease Management</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.2)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,255,255,0.2)" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Crop Distribution Pie */}
          <div className="card-glass p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Crop Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={cropsData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {cropsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {cropsData.map((crop) => (
                <div key={crop.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: crop.color }} />
                  <span className="text-slate-300">{crop.name}: {crop.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card-glass p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">API Server</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Database</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">AI Services</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">Running</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-300">GPS Sync</span>
                </div>
                <span className="text-xs text-amber-400 font-medium">Syncing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-glass p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Real-time Activity Feed</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { time: '2 min ago', event: 'Disease detected in Rice field, Hyderabad', severity: 'warn' },
              { time: '5 min ago', event: '250 acres irrigated via Drone Sprayer', severity: 'success' },
              { time: '8 min ago', event: 'Fertilizer order placed by Dealer #542', severity: 'info' },
              { time: '12 min ago', event: 'Machinery maintenance scheduled', severity: 'info' },
              { time: '15 min ago', event: 'Farmer registered from Karnataka', severity: 'success' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-2 border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.severity === 'warn' ? 'bg-amber-400' :
                  item.severity === 'success' ? 'bg-emerald-400' :
                  'bg-cyan-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">{item.event}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
