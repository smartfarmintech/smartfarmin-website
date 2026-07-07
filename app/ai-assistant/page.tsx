export const dynamic = 'force-dynamic'
export const metadata = { title: 'AI Crop Doctor | Akanksha | Rythu360', description: 'AI-powered agricultural assistant for disease detection and crop recommendations' }

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Upload, MessageSquare, Leaf, Zap, TrendingUp } from 'lucide-react'

async function getAIData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: conversations } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('last_message_at', { ascending: false })
    .limit(10)

  const { data: predictions } = await supabase
    .from('disease_predictions')
    .select('*')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return { conversations: conversations || [], predictions: predictions || [], user }
}

const features = [
  { icon: Leaf, title: 'Disease Detection', desc: 'Upload crop images for AI analysis' },
  { icon: Zap, title: 'Recommendations', desc: 'Get personalized fertilizer & irrigation advice' },
  { icon: TrendingUp, title: 'Yield Prediction', desc: 'Forecast your crop yield accurately' },
  { icon: MessageSquare, title: 'Chat Support', desc: 'Ask questions about your crops anytime' }
]

export default async function AIAssistantPage() {
  const data = await getAIData()
  if (!data) redirect('/login/farmer')

  const { conversations, predictions } = data

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">AI Crop Doctor</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Akanksha - Your AI Agricultural Assistant</h1>
            <p className="text-muted-foreground">Disease detection, crop recommendations, and intelligent farming guidance powered by AI</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="p-4 text-center hover:shadow-lg transition-shadow">
              <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analysis">Disease Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">👋 Hello! I'm Akanksha, your AI Crop Doctor. I can help you with:</p>
                <ul className="text-sm mt-3 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Disease & pest identification from images</li>
                  <li>Fertilizer and irrigation recommendations</li>
                  <li>Crop yield predictions</li>
                  <li>Weather-based farming advice</li>
                </ul>
              </div>

              {conversations.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversations.map((conv: any) => (
                    <div key={conv.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="font-semibold text-sm">{conv.title || 'Conversation'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conv.message_count} messages • {new Date(conv.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No conversations yet. Start chatting!</p>
              )}

              <Button className="w-full" asChild>
                <a href="/ai-assistant/chat">Start New Chat</a>
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="font-semibold mb-2">Upload Crop Image for Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">Get instant disease detection and treatment recommendations</p>
              </div>
              <Button asChild>
                <a href="/ai-assistant/disease-detection">Analyze Image</a>
              </Button>
            </div>
          </Card>

          {predictions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Analyses</h3>
              {predictions.map((pred: any) => (
                <Card key={pred.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{pred.predicted_disease}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {(pred.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <Badge className={pred.severity === 'severe' ? 'bg-red-500' : pred.severity === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {pred.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{pred.diagnosis}</p>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/ai-assistant/analysis/${pred.id}`}>View Details</a>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-3">
              {conversations.length > 0 ? (
                conversations.map((conv: any) => (
                  <div key={conv.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{conv.title || 'Untitled Conversation'}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.message_count} messages • {new Date(conv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {conv.is_archived && <Badge variant="secondary">Archived</Badge>}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/ai-assistant/conversation/${conv.id}`}>Open</a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-50 mb-2" />
                  <p>No chat history yet</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
