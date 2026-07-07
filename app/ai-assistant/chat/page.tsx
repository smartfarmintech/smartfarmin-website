'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Send, Mic, MicOff, Upload, Loader } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

interface ConversationState {
  conversationId: string | null
  language: 'en' | 'te' | 'hi'
  isRecording: boolean
  isUploading: boolean
}

export default function ChatPage() {
  const [state, setState] = useState<ConversationState>({
    conversationId: null,
    language: 'en',
    isRecording: false,
    isUploading: false
  })

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const response = await fetch('/api/ai/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Akanksha Chat - ${new Date().toLocaleDateString()}`,
            language: state.language
          })
        })

        if (response.ok) {
          const data = await response.json()
          setState((prev) => ({ ...prev, conversationId: data.id }))
        }
      } catch (error) {
        console.error('Failed to initialize conversation:', error)
      }
    }

    initializeConversation()
  }, [state.language])

  const handleSendMessage = async () => {
    if (!input.trim() || !state.conversationId || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: 'user', content: input }],
          conversationId: state.conversationId,
          language: state.language
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      let fullResponse = ''
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages((prev) => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let done = false
        while (!done) {
          const { value, done: streamDone } = await reader.read()
          done = streamDone

          if (value) {
            const chunk = decoder.decode(value)
            fullResponse += chunk

            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: fullResponse
              }
              return updated
            })
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        // TODO: Send audio to API for transcription
        const audioUrl = URL.createObjectURL(audioBlob)
        console.log('Recording stopped, audio:', audioUrl)
      }

      mediaRecorderRef.current.start()
      setState((prev) => ({ ...prev, isRecording: true }))
    } catch (error) {
      console.error('Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setState((prev) => ({ ...prev, isRecording: false }))
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !state.conversationId) return

    setState((prev) => ({ ...prev, isUploading: true }))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('conversationId', state.conversationId)

      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `🖼️ Image uploaded: ${file.name}`,
          role: 'user',
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          content: result.analysis,
          role: 'assistant',
          timestamp: new Date()
        }
      ])
    } catch (error) {
      console.error('Image upload error:', error)
    } finally {
      setState((prev) => ({ ...prev, isUploading: false }))
    }
  }

  const quickSuggestions = [
    'What should I do about yellowing leaves?',
    'When should I irrigate my cotton fields?',
    'What fertilizer do I need for wheat?',
    'Is my crop ready to harvest?'
  ]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Akanksha</h1>
            <p className="text-xs text-muted-foreground">AI Crop Doctor</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={state.language}
              onChange={(e) => setState((prev) => ({ ...prev, language: e.target.value as 'en' | 'te' | 'hi' }))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="text-5xl mb-4">🌾</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Akanksha</h2>
              <p className="text-muted-foreground mb-6">Your AI Crop Doctor. Ask me anything about your crops.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                {quickSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      setInput(suggestion)
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
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
                      className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Tools */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={state.isUploading}
              className="flex items-center gap-1"
            >
              {state.isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Image
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={state.isRecording ? stopRecording : startRecording}
              className={state.isRecording ? 'bg-red-100 text-red-600' : ''}
            >
              {state.isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-1" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-1" />
                  Record Voice
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your crops..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="lg">
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
