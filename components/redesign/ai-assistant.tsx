'use client'

import { MessageSquare, Send, Minus, X } from 'lucide-react'
import { useState } from 'react'

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'ai' }>>([
    { id: 1, text: "Hi! I'm Akansha, your AI farming assistant. How can I help you today?", sender: 'ai' }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessages = [
        ...messages,
        { id: messages.length + 1, text: inputValue, sender: 'user' as const }
      ]
      
      setTimeout(() => {
        const aiResponses = [
          "That's a great question! Based on your farm size and crops, I'd recommend checking our premium fertilizers.",
          "I can help you with that! Have you considered our drone services for crop monitoring?",
          "Smart choice! Let me suggest the best equipment for your needs.",
          "Your farm would benefit from our solar energy solutions. Would you like more details?",
          "I'm here to help! Visit our services section to book machinery rentals.",
        ]
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        
        setMessages(prev => [
          ...prev,
          { id: prev.length + 1, text: randomResponse, sender: 'ai' }
        ])
      }, 500)
      
      setMessages(newMessages)
      setInputValue('')
    }
  }

  return (
    <>
      {/* AI Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition flex items-center justify-center z-40"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 rounded-2xl shadow-2xl bg-card border border-border overflow-hidden z-50 transition-all ${
          isMinimized ? 'h-16' : 'h-96'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">
                A
              </div>
              <div>
                <h3 className="font-bold">Akansha</h3>
                <p className="text-xs opacity-90">AI Farming Assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition"
                aria-label="Minimize"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="h-72 overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-border p-4 bg-card flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Akansha..."
                  className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
