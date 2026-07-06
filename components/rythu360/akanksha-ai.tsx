"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  ArrowUp,
  Bug,
  Camera,
  CloudSun,
  Landmark,
  Lightbulb,
  Mic,
  Sparkles,
  TrendingUp,
  X,
  Brain,
  MessageCircle,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CAPABILITIES,
  type Capability,
  type ChatMessage,
  type InsightCard,
  makeMessage,
  scanResult,
} from "@/lib/rythu360/akanksha"
import { askAkanksha } from "@/lib/rythu360/akanksha-actions"

const CAP_ICON: Record<Capability["icon"], typeof Bug> = {
  disease: Bug,
  weather: CloudSun,
  market: TrendingUp,
  schemes: Landmark,
  reco: Lightbulb,
  camera: Camera,
  voice: Mic,
  yield: BarChart3,
  chat: MessageCircle,
}

// Local purple palette, scoped to this screen only.
const aiVars = {
  "--ai": "oklch(0.62 0.23 300)",
  "--ai-2": "oklch(0.7 0.2 330)",
  "--ai-soft": "oklch(0.62 0.23 300 / 0.14)",
} as React.CSSProperties

export function AkankshaAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const started = messages.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])

  async function respond(userText: string, attachment?: ChatMessage["attachment"]) {
    setMessages((m) => [...m, makeMessage("user", userText, attachment ? { attachment } : undefined)])
    setThinking(true)
    try {
      const reply = await askAkanksha(userText)
      setMessages((m) => [...m, makeMessage("ai", reply.text, { cards: reply.cards })])
    } finally {
      setThinking(false)
    }
  }

  function send() {
    const text = input.trim()
    if (!text || thinking) return
    setInput("")
    respond(text)
  }

  function runScan() {
    setScanOpen(false)
    setMessages((m) => [
      ...m,
      makeMessage("user", "Scan my crop leaf", { attachment: { kind: "scan", label: "Leaf photo · paddy" } }),
    ])
    setThinking(true)
    window.setTimeout(() => {
      const reply = scanResult()
      setThinking(false)
      setMessages((m) => [...m, makeMessage("ai", reply.text, { cards: reply.cards })])
    }, 1600)
  }

  function endVoice(transcript?: string) {
    setVoiceOpen(false)
    if (transcript) respond(transcript)
  }

  return (
    <div style={aiVars} className="relative flex h-svh flex-col overflow-hidden bg-background">
      {/* ambient purple glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--ai-soft), transparent 70%)" }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/app/dashboard"
          aria-label="Back to dashboard"
          className="flex size-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <Orb size={38} />
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 font-serif text-lg font-semibold leading-tight tracking-tight">
            Akanksha AI
            <Sparkles className="size-4" style={{ color: "var(--ai)" }} />
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" /> Online · Farming co-pilot
          </p>
        </div>
        {started && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="ml-auto rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-card"
          >
            New chat
          </button>
        )}
      </header>

      {/* Thread */}
      <div ref={scrollRef} className="relative z-0 flex-1 overflow-y-auto px-4">
        <div className="mx-auto w-full max-w-2xl py-6">
          {!started ? (
            <Welcome onPick={(c) => respond(c.prompt)} />
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}
              {thinking && <Thinking />}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="relative z-10 border-t border-border/60 bg-background/80 px-4 pb-5 pt-3 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-2xl">
          <div
            className="flex items-end gap-2 rounded-[1.75rem] border border-border/70 bg-card/70 p-2 shadow-sm backdrop-blur-xl"
            style={{ boxShadow: "0 0 0 1px var(--ai-soft), 0 8px 30px -12px var(--ai-soft)" }}
          >
            <button
              type="button"
              onClick={() => setScanOpen(true)}
              aria-label="Camera scan"
              className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Camera className="size-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  send()
                }
              }}
              rows={1}
              placeholder="Ask Akanksha anything about your farm…"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />
            {input.trim() ? (
              <button
                type="button"
                onClick={send}
                aria-label="Send message"
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-primary-foreground transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--ai), var(--ai-2))" }}
              >
                <ArrowUp className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                aria-label="Voice chat"
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-primary-foreground transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--ai), var(--ai-2))" }}
              >
                <Mic className="size-5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Akanksha can make mistakes. Verify critical decisions with an expert.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {voiceOpen && <VoiceOverlay onClose={endVoice} />}
        {scanOpen && <ScanOverlay onClose={() => setScanOpen(false)} onScan={runScan} />}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Animated orb avatar ---------------- */
function Orb({ size = 40, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      {pulse && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--ai)" }}
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--ai)" }}
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 1 }}
          />
        </>
      )}
      <motion.span
        className="relative flex h-full w-full items-center justify-center rounded-full"
        style={{
          background: "conic-gradient(from 0deg, var(--ai), var(--ai-2), var(--ai))",
          boxShadow: "0 0 20px -2px var(--ai)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <span className="absolute inset-[3px] rounded-full bg-background/85 backdrop-blur-sm" />
        <Sparkles className="relative size-1/2" style={{ color: "var(--ai)" }} />
      </motion.span>
    </span>
  )
}

/* ---------------- Welcome / empty state ---------------- */
function Welcome({ onPick }: { onPick: (c: Capability) => void }) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <Orb size={84} pulse />
      <h2 className="mt-6 text-balance font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        Namaste, I&apos;m Akanksha
      </h2>
      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        Your AI farming co-pilot. Ask about crop diseases, weather, market prices, government schemes, or get a
        personalised plan — by text, voice, or camera.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {CAPABILITIES.map((c) => {
          const Icon = CAP_ICON[c.icon]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c)}
              className="group flex items-center gap-3 rounded-3xl border border-border/70 bg-card/70 p-3.5 text-left backdrop-blur-xl transition-colors hover:bg-card"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                style={{ background: "var(--ai-soft)", color: "var(--ai)" }}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{c.desc}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- Message bubble ---------------- */
function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {isUser ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          RK
        </span>
      ) : (
        <Orb size={32} />
      )}

      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}>
        {message.attachment && (
          <div
            className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-medium"
            style={{ color: "var(--ai)" }}
          >
            <Camera className="size-4" /> {message.attachment.label}
          </div>
        )}
        <div
          className={cn(
            "whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-primary text-primary-foreground"
              : "rounded-tl-md border border-border/70 bg-card/80 text-card-foreground backdrop-blur-xl",
          )}
        >
          {message.text}
        </div>

        {message.cards && message.cards.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            {message.cards.map((c) => (
              <InsightTile key={c.title} card={c} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function InsightTile({ card }: { card: InsightCard }) {
  const toneColor =
    card.tone === "up" ? "text-primary" : card.tone === "down" ? "text-destructive" : "text-foreground"
  return (
    <div
      className="rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur-xl"
      style={{ boxShadow: "0 0 0 1px var(--ai-soft)" }}
    >
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{card.title}</p>
      <p className={cn("mt-0.5 text-sm font-semibold tracking-tight", toneColor)}>{card.value}</p>
      {card.hint && <p className="text-[11px] text-muted-foreground">{card.hint}</p>}
    </div>
  )
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <Orb size={32} />
      <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-md border border-border/70 bg-card/80 px-4 py-4 backdrop-blur-xl">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full"
            style={{ background: "var(--ai)" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Voice chat overlay ---------------- */
function VoiceOverlay({ onClose }: { onClose: (transcript?: string) => void }) {
  const [phase, setPhase] = useState<"listening" | "heard">("listening")
  const transcript = "What's today's paddy mandi price?"

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("heard"), 2600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, oklch(0.32 0.12 300 / 0.95), oklch(0.16 0.03 300 / 0.98))",
        backdropFilter: "blur(8px)",
      }}
    >
      <button
        type="button"
        onClick={() => onClose()}
        aria-label="Close voice chat"
        className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {/* pulsing rings */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ width: 160, height: 160, border: "1px solid rgba(255,255,255,0.25)" }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: i * 0.8 }}
          />
        ))}
        <motion.div
          className="flex size-40 items-center justify-center rounded-full"
          style={{
            background: "conic-gradient(from 0deg, var(--ai), var(--ai-2), var(--ai))",
            boxShadow: "0 0 60px 0 var(--ai)",
          }}
          animate={{ rotate: 360, scale: phase === "listening" ? [1, 1.06, 1] : 1 }}
          transition={{
            rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          <div className="flex items-end gap-1.5">
            {[0.5, 1, 0.7, 1.2, 0.6].map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-white"
                animate={{ scaleY: phase === "listening" ? [h, h * 2, h] : 0.4 }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
                style={{ height: 26 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <p className="mt-14 text-sm font-medium uppercase tracking-widest text-white/70">
        {phase === "listening" ? "Listening…" : "Got it"}
      </p>
      <p className="mt-3 max-w-sm text-balance text-center font-serif text-2xl font-semibold text-white">
        {phase === "listening" ? "Speak now" : `"${transcript}"`}
      </p>

      {phase === "heard" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={() => onClose(transcript)}
          className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
        >
          Ask Akanksha
        </motion.button>
      )}
    </motion.div>
  )
}

/* ---------------- Camera scan overlay ---------------- */
function ScanOverlay({ onClose, onScan }: { onClose: () => void; onScan: () => void }) {
  const [scanning, setScanning] = useState(false)

  function start() {
    setScanning(true)
    window.setTimeout(onScan, 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-6 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close camera"
        className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      <p className="mb-5 text-sm font-medium uppercase tracking-widest text-white/70">Crop Disease Scan</p>

      {/* viewfinder */}
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/20">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, oklch(0.4 0.09 150), oklch(0.28 0.05 155))" }}
        />
        {/* faux leaf silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="size-24 text-white/15" />
        </div>

        {/* corner brackets */}
        {[
          "left-4 top-4 border-l-2 border-t-2",
          "right-4 top-4 border-r-2 border-t-2",
          "left-4 bottom-4 border-l-2 border-b-2",
          "right-4 bottom-4 border-r-2 border-b-2",
        ].map((c) => (
          <span key={c} className={cn("absolute size-9 rounded-md", c)} style={{ borderColor: "var(--ai-2)" }} />
        ))}

        {/* scanline */}
        {scanning && (
          <motion.div
            className="absolute inset-x-0 h-16"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--ai-soft), transparent)",
              boxShadow: "0 0 24px 4px var(--ai)",
            }}
            initial={{ top: "-10%" }}
            animate={{ top: ["-10%", "100%"] }}
            transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        )}
      </div>

      <p className="mt-6 max-w-xs text-balance text-center text-sm text-white/70">
        {scanning ? "Analysing leaf for diseases…" : "Point at an affected leaf and hold steady"}
      </p>

      <button
        type="button"
        onClick={start}
        disabled={scanning}
        className="mt-6 flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, var(--ai), var(--ai-2))" }}
      >
        <Camera className="size-4" /> {scanning ? "Scanning…" : "Scan now"}
      </button>
    </motion.div>
  )
}
