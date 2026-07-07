'use client'

import { AuthenticDashboardPreview } from './dashboard/authentic-dashboard-preview'

export function EnterpriseDashboardShowcase() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-slate-900/50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Enterprise Intelligence</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-3xl mx-auto">
            Real-Time Dashboard for Intelligent Decision Making
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Comprehensive analytics, real-time monitoring, and actionable insights. Monitor your entire agricultural operation from a single, beautiful interface designed for enterprise leaders.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          {/* Shadow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 to-emerald-500/5 rounded-2xl blur-2xl" />
          
          <div className="relative">
            <AuthenticDashboardPreview />
          </div>
        </div>

        {/* Features Grid Below Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="card-glass p-6 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Real-Time Monitoring</h3>
            <p className="text-sm text-slate-400">
              Live updates on machinery, crop health, weather alerts, and IoT sensor data across all your operations.
            </p>
          </div>

          <div className="card-glass p-6 space-y-3 hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Advanced Analytics</h3>
            <p className="text-sm text-slate-400">
              Powerful business intelligence with trend analysis, forecasting, and comparative reporting for strategic planning.
            </p>
          </div>

          <div className="card-glass p-6 space-y-3 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Smart Automation</h3>
            <p className="text-sm text-slate-400">
              Automated alerts, workflow optimization, and predictive maintenance recommendations powered by AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
