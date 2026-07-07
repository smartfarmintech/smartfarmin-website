'use client';

import React, { useState } from 'react';
import { TrendingUp, Cloud, Leaf, AlertTriangle, BarChart3, Zap, Bell, Microscope } from 'lucide-react';
import { GlassCard } from '@/components/cards/glass-card';

interface DashboardWidget {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
  color: string;
}

const widgets: DashboardWidget[] = [
  {
    id: 'crop-health',
    title: 'Crop Health',
    value: '92%',
    subtitle: 'Overall health score',
    icon: <Leaf className="size-6" />,
    status: 'good',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'disease-detection',
    title: 'Disease Detection',
    value: '0',
    subtitle: 'Potential diseases detected',
    icon: <AlertTriangle className="size-6" />,
    status: 'good',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'weather',
    title: 'Weather',
    value: '28°C',
    subtitle: 'Current temperature',
    icon: <Cloud className="size-6" />,
    status: 'good',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'soil-analysis',
    title: 'Soil Analysis',
    value: 'Optimal',
    subtitle: 'pH: 6.8 | Moisture: 65%',
    icon: <Microscope className="size-6" />,
    status: 'good',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'market-prices',
    title: 'Market Prices',
    value: '₹4,250',
    subtitle: 'Current crop rate',
    icon: <TrendingUp className="size-6" />,
    status: 'good',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'profit',
    title: 'Profit Prediction',
    value: '+18%',
    subtitle: 'Expected yield increase',
    icon: <BarChart3 className="size-6" />,
    status: 'good',
    color: 'from-emerald-500 to-teal-600',
  },
];

const alerts = [
  { id: 1, type: 'info', title: 'Irrigation Recommended', desc: 'Soil moisture below optimal level', icon: '💧' },
  { id: 2, type: 'warning', title: 'Weather Alert', desc: 'Light rain expected in 2 hours', icon: '🌧️' },
  { id: 3, type: 'success', title: 'Pest Control Done', desc: 'Field inspected - no pests detected', icon: '✓' },
];

export function AiDashboard() {
  const [selectedWidget, setSelectedWidget] = useState('crop-health');

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Futuristic AI Dashboard
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">
            Real-time crop monitoring with predictive AI insights and smart recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left sidebar - Widget selector */}
          <div className="space-y-3">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => setSelectedWidget(widget.id)}
                className={`w-full p-4 rounded-lg border transition-all text-left fade-in ${
                  selectedWidget === widget.id
                    ? 'bg-white/10 border-green-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${widget.color} text-white`}>
                    {widget.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{widget.title}</h4>
                    <p className="text-xs text-white/60">{widget.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main dashboard content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Selected widget detail */}
            <GlassCard variant="lg" className="fade-in">
              {widgets.find(w => w.id === selectedWidget) && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {widgets.find(w => w.id === selectedWidget)?.title}
                      </h3>
                      <p className="text-white/70">
                        {widgets.find(w => w.id === selectedWidget)?.subtitle}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${widgets.find(w => w.id === selectedWidget)?.color} text-white`}>
                      {widgets.find(w => w.id === selectedWidget)?.icon}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="text-5xl font-bold text-white mb-4">
                      {widgets.find(w => w.id === selectedWidget)?.value}
                    </div>
                    
                    {/* Chart placeholder */}
                    <div className="h-40 bg-white/5 rounded-lg border border-white/10 flex items-end justify-around px-4 py-8">
                      {[65, 40, 75, 55, 85, 70, 90].map((height, idx) => (
                        <div
                          key={idx}
                          className="flex-1 mx-1 rounded-t-lg bg-gradient-to-t from-green-600 to-green-400 transition-all hover:from-green-500 hover:to-green-300"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-semibold text-white mb-3">AI Recommendations</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        Soil nutrients are well-balanced for current crop stage
                      </li>
                      <li className="text-sm text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        Expected yield increase of 18% based on current growth rate
                      </li>
                      <li className="text-sm text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        Schedule irrigation in next 48 hours to optimize production
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Alerts section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="size-6" />
                Live Alerts
              </h3>
              {alerts.map((alert) => (
                <GlassCard key={alert.id} className="fade-in flex items-start gap-4">
                  <div className="text-3xl">{alert.icon}</div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-white">{alert.title}</h4>
                    <p className="text-sm text-white/70">{alert.desc}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    alert.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                    alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {alert.type.toUpperCase()}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg Yield', value: '45 tons/acre', icon: '📊' },
                { label: 'Water Usage', value: '2,500 L/acre', icon: '💧' },
                { label: 'Pest Risk', value: 'Low', icon: '🦗' },
                { label: 'Best Time', value: 'Day 5pm', icon: '🌅' },
              ].map((stat, idx) => (
                <GlassCard key={idx} className="fade-in text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <p className="text-xs text-white/70 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
