"use client"

import { Brain, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

interface ContextItem {
  id: string
  type: "field" | "crop" | "issue" | "preference"
  label: string
  value: string
  icon: React.ReactNode
}

interface ChatContextPanelProps {
  context: ContextItem[]
  onAddContext?: (type: ContextItem["type"]) => void
  onRemoveContext?: (id: string) => void
}

export function ChatContextPanel({
  context,
  onAddContext,
  onRemoveContext,
}: ChatContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const contextByType = context.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, ContextItem[]>)

  return (
    <Card className="border border-border/70 bg-card">
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Chat Memory</CardTitle>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {context.length} items
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {context.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tell me about your farm and I'll remember it.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(contextByType).map(([type, items]) => (
                    <div key={type} className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        {type}s ({items.length})
                      </p>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-primary">{item.icon}</span>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{item.label}</p>
                                <p className="text-muted-foreground truncate">{item.value}</p>
                              </div>
                            </div>
                            {onRemoveContext && (
                              <button
                                onClick={() => onRemoveContext(item.id)}
                                className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {onAddContext && (
                <Button
                  onClick={() => onAddContext("field")}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Plus className="h-3 w-3" />
                  Add Context
                </Button>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
