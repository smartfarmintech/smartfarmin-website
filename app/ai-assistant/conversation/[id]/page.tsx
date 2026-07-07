'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Share2, Trash2, MessageSquare, Calendar } from 'lucide-react'

import ReactMarkdown from 'react-markdown'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  language: string
  message_count: number
  created_at: string
  last_message_at: string
}

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params?.id as string

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const supabase = createClient()

        // Get conversation details
        const { data: conv } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('id', conversationId)
          .single()

        setConversation(conv)

        // Get messages
        const { data: msgs } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        setMessages(msgs || [])
      } catch (error) {
        console.error('Error loading conversation:', error)
      } finally {
        setLoading(false)
      }
    }

    if (conversationId) {
      loadConversation()
    }
  }, [conversationId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return

    try {
      const supabase = createClient()

      // Save user message
      const { data: userMsg } = await supabase
        .from('ai_messages')
        .insert([
          {
            conversation_id: conversationId,
            role: 'user',
            content: newMessage,
            created_at: new Date()
          }
        ])
        .select()
        .single()

      if (userMsg) {
        setMessages((prev) => [...prev, userMsg])
        setNewMessage('')

        // Get AI response
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content: newMessage }
            ],
            conversationId
          })
        })

        if (response.ok) {
          const aiResponse = await response.json()

          const { data: assistantMsg } = await supabase
            .from('ai_messages')
            .insert([
              {
                conversation_id: conversationId,
                role: 'assistant',
                content: aiResponse.message,
                created_at: new Date()
              }
            ])
            .select()
            .single()

          if (assistantMsg) {
            setMessages((prev) => [...prev, assistantMsg])
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/ai/export-conversation/${conversationId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${conversation?.title || 'conversation'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading conversation:', error)
    }
  }

  const handleDeleteConversation = async () => {
    if (!confirm('Delete this conversation?')) return

    try {
      const supabase = createClient()
      await supabase
        .from('ai_conversations')
        .update({ deleted_at: new Date() })
        .eq('id', conversationId)

      window.location.href = '/ai-assistant/dashboard'
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold">{conversation?.title}</h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(conversation?.created_at || '').toLocaleDateString()}
              </span>
              <span>{messages.length} messages</span>
              <Badge variant="secondary">{conversation?.language?.toUpperCase()}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleDeleteConversation}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                
                
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border shadow-sm rounded-bl-none'
                  }`}
                >
                  <div className={msg.role === 'user' ? 'text-white' : ''}>
                    <ReactMarkdown className="prose prose-sm max-w-none">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
