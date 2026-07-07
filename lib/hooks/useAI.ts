import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Language, AIMessage, CropAnalysis } from '@/lib/ai/types'

export function useAI() {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const initializeConversation = useCallback(
    async (language: Language = 'en', title?: string) => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const response = await fetch('/api/ai/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title || `Chat - ${new Date().toLocaleDateString()}`,
            language
          })
        })

        if (!response.ok) throw new Error('Failed to create conversation')

        const data = await response.json()
        setConversationId(data.id)
        setMessages([])
        return data.id
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error initializing conversation'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  const sendMessage = useCallback(
    async (content: string, language: Language = 'en') => {
      if (!conversationId) throw new Error('No active conversation')

      try {
        setIsLoading(true)
        setError(null)

        // Add user message to UI
        const userMessage: AIMessage = {
          id: Date.now().toString(),
          conversationId,
          role: 'user',
          content,
          contentType: 'text',
          createdAt: new Date()
        }
        setMessages((prev) => [...prev, userMessage])

        // Get AI response
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content }
            ],
            conversationId,
            language
          })
        })

        if (!response.ok) throw new Error('Failed to get AI response')

        // Stream response
        let fullResponse = ''
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          conversationId,
          role: 'assistant',
          content: '',
          contentType: 'text',
          createdAt: new Date()
        }

        setMessages((prev) => [...prev, assistantMessage])

        if (reader) {
          let done = false
          while (!done) {
            const { value, done: streamDone } = await reader.read()
            done = streamDone

            if (value) {
              const chunk = decoder.decode(value)
              fullResponse += chunk

              // Update assistant message as it streams
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

        return fullResponse
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error sending message'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, messages]
  )

  const analyzeImage = useCallback(
    async (imageUrl: string, analysisType: 'disease' | 'pest' | 'deficiency' = 'disease') => {
      if (!conversationId) throw new Error('No active conversation')

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl,
            conversationId,
            analysisType
          })
        })

        if (!response.ok) throw new Error('Failed to analyze image')

        const data: { analysis: string; data: CropAnalysis } = await response.json()

        // Add analysis to messages
        const analysisMessage: AIMessage = {
          id: Date.now().toString(),
          conversationId,
          role: 'assistant',
          content: data.analysis,
          contentType: 'text',
          images: [imageUrl],
          createdAt: new Date()
        }

        setMessages((prev) => [...prev, analysisMessage])
        return data.data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error analyzing image'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId]
  )

  const clearConversation = useCallback(() => {
    setConversationId(null)
    setMessages([])
    setError(null)
  }, [])

  return {
    conversationId,
    messages,
    isLoading,
    error,
    initializeConversation,
    sendMessage,
    analyzeImage,
    clearConversation
  }
}
