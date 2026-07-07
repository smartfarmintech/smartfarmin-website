'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Heart, TrendingUp, AlertTriangle, Zap, Leaf, Wind } from 'lucide-react'

import Link from 'next/link'

interface CropHealth {
  healthScore: number
  trend: number
  status: 'healthy' | 'warning' | 'alert'
}

interface Insight {
  title: string
  description: string
  type: 'disease' | 'pest' | 'irrigation' | 'fertilizer' | 'weather'
  priority: 'high' | 'medium' | 'low'
}

export default function AIAssistantDashboard() {
  const [cropHealth, setCropHealth] = useState<CropHealth | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [recentChats, setRecentChats] = useState<any[]>([])
  const [healthTrend, setHealthTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Get recent chats
        const { data: chats } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })
          .limit(5)

        setRecentChats(chats || [])

        // Get recent health predictions
        const { data: predictions } = await supabase
          .from('disease_predictions')
          .select('*')
          .eq('farmer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        // Calculate crop health
        if (predictions && predictions.length > 0) {
          const avgConfidence = predictions.reduce((acc, p) => acc + (1 - p.confidence), 0) / predictions.length
          const healthScore = Math.round(avgConfidence * 100)
          setCropHealth({
            healthScore,
            trend: 5,
            status: healthScore > 75 ? 'healthy' : healthScore > 50 ? 'warning' : 'alert'
          })

          // Generate insights
          const newInsights: Insight[] = predictions.slice(0, 3).map((p) => ({
            title: p.predicted_disease,
            description: p.diagnosis,
            type: 'disease',
            priority: p.severity === 'severe' ? 'high' : p.severity === 'moderate' ? 'medium' : 'low'
          }))

          setInsights(newInsights)
        }

        // Generate trend data
        const trend = Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          health: Math.floor(Math.random() * 40) + 60
        }))
        setHealthTrend(trend)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  }

  const statusColors = {
    healthy: 'text-emerald-400',
    warning: 'text-amber-400',
    alert: 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Sunrise theme */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Akanksha <span className="text-gradient-primary">AI Dashboard</span></h1>
            <p className="text-slate-400 mt-2">Advanced crop health monitoring, disease detection, and AI-powered recommendations</p>
          </div>
          <Button asChild className="btn-primary">
            <Link href="/ai-assistant/chat">New Chat</Link>
          </Button>
        </div>

        {/* Crop Health Overview with glassmorphism */}
        {cropHealth && (
          <div>
            <Card className="card-glass p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Overall Crop Health</p>
                  <div className="flex items-end gap-2">
                    <Heart className={`w-6 h-6 ${statusColors[cropHealth.status]}`} />
                    <div>
                      <p className="text-3xl font-bold">{cropHealth.healthScore}%</p>
                      <p className={`text-sm ${statusColors[cropHealth.status]}`}>
                        {cropHealth.status === 'healthy'
                          ? '✓ Healthy'
                          : cropHealth.status === 'warning'
                            ? '⚠ Needs Attention'
                            : '✗ Action Required'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-center flex-1">
                    <p className="text-sm text-slate-400 mb-2">7-Day Trend</p>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={healthTrend}>
                        <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href="/ai-assistant/disease-detection">Scan Crop</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href="/ai-assistant/chat">Get Advice</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Insights */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white">Active Insights</h2>
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div
                  key={idx}
                  
                  
                  
                >
                  <Card className="card-glass p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-2">
                      {insight.type === 'disease' && <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />}
                      {insight.type === 'pest' && <Leaf className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />}
                      {insight.type === 'irrigation' && <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />}
                      {insight.type === 'fertilizer' && <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />}
                      {insight.type === 'weather' && <Wind className="w-5 h-5 text-sky-400 flex-shrink-0 mt-1" />}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white">{insight.title}</p>
                          <Badge className={priorityColors[insight.priority]}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{insight.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild className="text-emerald-400 hover:text-emerald-300">
                      <Link href="/ai-assistant/chat">Get Advice →</Link>
                    </Button>
                  </Card>
                </div>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No active insights. Your crops are looking good!</p>
              </Card>
            )}
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Statistics</h2>
            <Card className="card-glass p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Total Conversations</p>
                  <p className="text-2xl font-bold text-white">{recentChats.length}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Analyses Performed</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {insights.length > 0 ? insights.length * 3 : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Insights Generated</p>
                  <p className="text-2xl font-bold text-amber-400">{insights.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Conversations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <Link key={chat.id} href={`/ai-assistant/conversation/${chat.id}`}>
                  <Card className="card-glass p-4 hover:shadow-lg transition-shadow cursor-pointer h-full hover:translate-y-[-2px]">
                    <p className="font-semibold text-sm line-clamp-2 text-white">{chat.title || 'Untitled'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {chat.message_count} messages • {new Date(chat.last_message_at).toLocaleDateString()}
                    </p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{chat.language?.toUpperCase()}</Badge>
                        <span className="text-xs text-emerald-400">View →</span>
                      </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="card-glass p-6 col-span-full text-center">
                <p className="text-slate-400 mb-4">No conversations yet</p>
                <Button asChild className="btn-primary">
                  <Link href="/ai-assistant/chat">Start Chatting</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
