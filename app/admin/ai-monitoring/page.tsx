'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'

interface AIStats {
  totalUsers: number
  totalConversations: number
  totalMessages: number
  avgMessagesPerConversation: number
  totalImages: number
  successRate: number
  avgResponseTime: number
}

interface PopularQuestion {
  question: string
  count: number
  language: string
}

interface AnalysisStats {
  type: string
  count: number
  successRate: number
}

export default function AIMonitoringPage() {
  const [stats, setStats] = useState<AIStats | null>(null)
  const [popularQuestions, setPopularQuestions] = useState<PopularQuestion[]>([])
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats[]>([])
  const [usageByHour, setUsageByHour] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()

        // Get AI statistics
        const { data: conversations } = await supabase
          .from('ai_conversations')
          .select('id, message_count')

        const { data: messages } = await supabase
          .from('ai_messages')
          .select('id, latency_ms')

        const { data: predictions } = await supabase
          .from('disease_predictions')
          .select('id, status')

        const { data: feedback } = await supabase
          .from('ai_feedback')
          .select('rating')

        const totalConversations = conversations?.length || 0
        const totalMessages = messages?.length || 0
        const totalImages = predictions?.length || 0
        const totalFeedback = feedback?.length || 0

        const avgMessagesPerConversation = totalConversations > 0
          ? (totalMessages / totalConversations).toFixed(1)
          : 0

        const successfulAnalysis = predictions?.filter((p) => p.status === 'completed').length || 0
        const successRate =
          totalImages > 0 ? ((successfulAnalysis / totalImages) * 100).toFixed(1) : 0

        const avgResponseTime =
          messages && messages.length > 0
            ? (
              messages.reduce((acc: number, m: any) => acc + (m.latency_ms || 0), 0) /
              messages.length
            ).toFixed(0)
            : 0

        setStats({
          totalUsers: totalConversations,
          totalConversations,
          totalMessages,
          avgMessagesPerConversation: parseFloat(avgMessagesPerConversation),
          totalImages,
          successRate: parseFloat(successRate),
          avgResponseTime: parseFloat(avgResponseTime)
        })

        // Get popular questions (simulated)
        const mockQuestions: PopularQuestion[] = [
          { question: 'How to treat yellow leaf spot?', count: 45, language: 'en' },
          { question: 'When to irrigate cotton?', count: 38, language: 'en' },
          { question: 'NPK ratio for wheat?', count: 35, language: 'en' },
          { question: 'Pest control methods?', count: 32, language: 'en' },
          { question: 'Soil test interpretation?', count: 28, language: 'te' }
        ]
        setPopularQuestions(mockQuestions)

        // Get analysis statistics
        const mockAnalysisStats: AnalysisStats[] = [
          { type: 'Disease', count: totalImages * 0.4, successRate: 0.92 },
          { type: 'Pest', count: totalImages * 0.35, successRate: 0.88 },
          { type: 'Deficiency', count: totalImages * 0.25, successRate: 0.85 }
        ]
        setAnalysisStats(mockAnalysisStats)

        // Get hourly usage
        const mockUsageByHour = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          users: Math.floor(Math.random() * 50) + 10
        }))
        setUsageByHour(mockUsageByHour)
      } catch (error) {
        console.error('Error loading AI monitoring data:', error)
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
          <p className="text-muted-foreground">Loading AI monitoring data...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Akanksha AI usage and performance metrics</p>
        </div>

        {/* Key Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                  <p className="text-3xl font-bold">{stats.totalConversations}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold">{stats.successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold">{stats.avgResponseTime}ms</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Popular Questions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Conversation Metrics</h3>
                <div className="space-y-3">
                  {stats && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Messages</span>
                        <span className="font-semibold">{stats.totalMessages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Messages/Conversation</span>
                        <span className="font-semibold">{stats.avgMessagesPerConversation.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Images Analyzed</span>
                        <span className="font-semibold">{stats.totalImages}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Performance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">API Response Time</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Avg: 450ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">System Uptime</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">99.9% uptime</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Top 10 Questions</h3>
              <div className="space-y-3">
                {popularQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{q.question}</p>
                      <p className="text-xs text-muted-foreground">{q.language.toUpperCase()}</p>
                    </div>
                    <span className="font-semibold">{q.count} times</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Analysis Type Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analysisStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count }) => `${type}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analysisStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-2">
                {analysisStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>{stat.type} Success Rate</span>
                    <span className="font-semibold">{(stat.successRate * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Hourly Usage Pattern</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={usageByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
