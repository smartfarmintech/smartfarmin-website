"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react"
import { ROLES, type RoleId } from "@/lib/rythu360/roles"
import { useSession } from "@/components/rythu360/session-provider"
import { ThemeToggle } from "@/components/rythu360/theme-toggle"
import { cn } from "@/lib/utils"

export function LoginScreen() {
  const router = useRouter()
  const { login } = useSession()
  const [selected, setSelected] = useState<RoleId | null>(null)

  function handleSelect(role: RoleId) {
    setSelected(role)
    login(role)
    // brief delay so the selection animation is visible
    setTimeout(() => router.push("/app/dashboard"), 260)
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        {/* top bar */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Rythu<span className="text-primary">360</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur sm:inline-flex">
              <ShieldCheck className="size-3.5 text-primary" />
              Secure workspace
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* heading */}
        <div className="mx-auto mt-10 max-w-2xl text-center sm:mt-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-3.5 text-accent" />
            SmartFarmin Technologies · Agriculture Super App
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-balance font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            Choose your workspace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground"
          >
            One platform, ten roles. Select how you work with Rythu360 to enter
            your personalised dashboard.
          </motion.p>
        </div>

        {/* role grid */}
        <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ROLES.map((role, i) => {
            const Icon = role.icon
            const isSelected = selected === role.id
            return (
              <motion.button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.03 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isSelected}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-3xl border border-border/70 bg-card/70 p-5 text-left backdrop-blur-xl transition-colors",
                  "hover:border-primary/40 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "border-primary ring-3 ring-ring/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                    role.accent,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-semibold tracking-tight">{role.label}</h2>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-primary/80">
                    {role.tagline}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {role.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
                  Continue
                  <ArrowRight className="size-4" />
                </span>
              </motion.button>
            )
          })}
        </div>

        <footer className="mt-10 pb-2 text-center text-xs text-muted-foreground">
          Demo access · Roles are for preview only. No password required.
        </footer>
      </div>
    </div>
  )
}
