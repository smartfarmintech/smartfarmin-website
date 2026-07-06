"use client"

import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"
import { useState, useEffect } from "react"

interface VoiceAssistantProps {
  isListening?: boolean
  transcript?: string
  language?: string
  onStart?: () => void
  onStop?: () => void
  onClear?: () => void
}

export function VoiceAssistant({
  isListening = false,
  transcript = "",
  language = "en-IN",
  onStart,
  onStop,
  onClear,
}: VoiceAssistantProps) {
  const [volume, setVolume] = useState<number[]>([0.3, 0.6, 0.4, 0.8, 0.5])

  useEffect(() => {
    if (!isListening) return

    const interval = setInterval(() => {
      setVolume((prev) =>
        prev.map(() => Math.random() * 0.8 + 0.2)
      )
    }, 100)

    return () => clearInterval(interval)
  }, [isListening])

  const languages = [
    { code: "en-IN", label: "English" },
    { code: "te-IN", label: "Telugu" },
    { code: "ta-IN", label: "Tamil" },
    { code: "kn-IN", label: "Kannada" },
    { code: "hi-IN", label: "Hindi" },
  ]

  return (
    <Card className="border border-border/70 bg-card/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visualizer */}
        <div className="flex items-end justify-center gap-1 py-8 px-4 bg-muted/50 rounded-lg">
          {[0, 1, 2, 3, 4].map((idx) => (
            <motion.div
              key={idx}
              className="w-2 rounded-full bg-gradient-to-t from-primary to-primary/50"
              style={{ height: isListening ? `${volume[idx] * 100}px` : "8px" }}
              animate={{ height: isListening ? `${volume[idx] * 100}px` : "8px" }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Transcript</p>
            <p className="text-sm text-foreground">{transcript}</p>
          </div>
        )}

        {/* Language Selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Language</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => {}}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isListening ? (
            <Button
              onClick={onStart}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
            >
              <Mic className="h-4 w-4" />
              Start Listening
            </Button>
          ) : (
            <Button
              onClick={onStop}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <MicOff className="h-4 w-4" />
              Stop
            </Button>
          )}

          {transcript && (
            <Button
              onClick={onClear}
              variant="outline"
              size="icon"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {isListening ? "Listening..." : "Click start and speak naturally"}
        </p>
      </CardContent>
    </Card>
  )
}
