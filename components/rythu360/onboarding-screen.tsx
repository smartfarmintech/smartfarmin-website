"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowRight,
  Check,
  CloudSun,
  Droplets,
  Leaf,
  LogIn,
  Sprout,
  Tractor,
  Wheat,
} from "lucide-react"
import { ThemeToggle } from "@/components/rythu360/theme-toggle"
import { cn } from "@/lib/utils"

const LANG_KEY = "rythu360.lang"

const LANGUAGES = [
  { id: "en", label: "English", native: "English" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "hi", label: "Hindi", native: "हिंदी" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
] as const

type LangId = (typeof LANGUAGES)[number]["id"]

// Floating agriculture illustrations scattered around the scene.
const FLOATERS = [
  { Icon: Wheat, className: "left-[6%] top-[18%]", size: "size-6", delay: 0, dur: 6 },
  { Icon: Sprout, className: "left-[13%] top-[62%]", size: "size-5", delay: 0.8, dur: 7 },
  { Icon: Droplets, className: "left-[24%] top-[30%]", size: "size-5", delay: 1.4, dur: 5.5 },
  { Icon: Tractor, className: "right-[8%] top-[26%]", size: "size-6", delay: 0.4, dur: 6.5 },
  { Icon: CloudSun, className: "right-[16%] top-[60%]", size: "size-5", delay: 1.1, dur: 7.5 },
  { Icon: Leaf, className: "right-[26%] top-[14%]", size: "size-5", delay: 1.7, dur: 6 },
]

export function OnboardingScreen() {
  const router = useRouter()
  const [lang, setLang] = useState<LangId>("en")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_KEY) as LangId | null
      if (stored) setLang(stored)
    } catch {
      // ignore storage errors
    }
  }, [])

  function selectLang(id: LangId) {
    setLang(id)
    try {
      window.localStorage.setItem(LANG_KEY, id)
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* ---------- Animated farmland scene ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* sky wash */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),color-mix(in_oklab,var(--primary)_8%,var(--background)))]" />

        {/* sun */}
        <motion.div
          className="absolute right-[12%] top-[10%] size-28 rounded-full bg-accent/40 blur-2xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="absolute right-[14%] top-[12%] size-16 rounded-full bg-accent/70 shadow-[0_0_60px_20px_color-mix(in_oklab,var(--accent)_40%,transparent)]" />

        {/* drifting clouds */}
        {[
          { top: "16%", size: "h-8 w-28", dur: 26, delay: 0 },
          { top: "30%", size: "h-6 w-20", dur: 34, delay: 4 },
          { top: "22%", size: "h-7 w-24", dur: 30, delay: 10 },
        ].map((c, i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full bg-foreground/5 blur-md", c.size)}
            style={{ top: c.top }}
            initial={{ x: "-20vw" }}
            animate={{ x: "120vw" }}
            transition={{
              duration: c.dur,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: c.delay,
            }}
          />
        ))}

        {/* layered rolling hills */}
        <svg
          className="absolute inset-x-0 bottom-0 h-[46svh] w-full"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
        >
          <path
            d="M0 300 C 240 240 420 360 720 320 C 1020 280 1200 360 1440 300 L1440 520 L0 520 Z"
            fill="color-mix(in oklab, var(--primary) 22%, var(--background))"
          />
          <path
            d="M0 380 C 300 320 500 430 780 400 C 1060 370 1240 440 1440 390 L1440 520 L0 520 Z"
            fill="color-mix(in oklab, var(--primary) 42%, var(--background))"
          />
          <path
            d="M0 460 C 320 420 560 500 900 470 C 1180 445 1300 500 1440 470 L1440 520 L0 520 Z"
            fill="color-mix(in oklab, var(--primary) 68%, var(--background))"
          />
        </svg>

        {/* swaying crop row on the front hill */}
        <div className="absolute inset-x-0 bottom-[4%] flex items-end justify-center gap-3 px-6">
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.div
              key={i}
              className="origin-bottom text-primary-foreground/70"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{
                duration: 3 + (i % 5) * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: (i % 7) * 0.2,
              }}
            >
              <Wheat className="size-5 sm:size-6" />
            </motion.div>
          ))}
        </div>

        {/* floating agriculture illustrations */}
        {FLOATERS.map(({ Icon, className, size, delay, dur }, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute flex items-center justify-center rounded-2xl border border-border/60 bg-card/50 p-2.5 text-primary backdrop-blur-md",
              className,
            )}
            animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
            transition={{
              duration: dur,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon className={size} />
          </motion.div>
        ))}
      </div>

      {/* ---------- Foreground content ---------- */}
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        {/* top bar */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Smart<span className="text-primary">Farmin</span>
            </span>
          </Link>
          <ThemeToggle />
        </header>

        {/* centered glass card */}
        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-[2rem] border border-border/70 bg-card/70 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            {/* logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg"
            >
              <Sprout className="size-8" />
            </motion.div>

            <p className="text-sm font-medium tracking-wide text-primary">
              Welcome to Rythu<span className="text-accent">360</span>
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              One Platform. One Login.
              <br />
              One Agriculture Ecosystem.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
              From crop planning to market access, drones to advisory — everything
              a modern farm needs, unified in a single premium workspace.
            </p>

            {/* actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/app/auth?mode=register"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/app/auth"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
                >
                  <LogIn className="size-4" />
                  Login
                </Link>
              </motion.div>
            </div>

            {/* language selection */}
            <div className="mt-8 border-t border-border/60 pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Choose your language
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {LANGUAGES.map((l) => {
                  const active = lang === l.id
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => selectLang(l.id)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/70 bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                      {l.label}
                      <span className="text-xs text-muted-foreground">{l.native}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
