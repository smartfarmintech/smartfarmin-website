"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudSun,
  Droplets,
  Leaf,
  Loader2,
  Phone,
  ShieldCheck,
  Sprout,
  Tractor,
  Wheat,
} from "lucide-react"
import { useSession } from "@/components/rythu360/session-provider"
import { ThemeToggle } from "@/components/rythu360/theme-toggle"
import { cn } from "@/lib/utils"

type Mode = "login" | "register"
type Step = "entry" | "otp"
type RegRole = "farmer" | "operator"

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

/* ---------- brand marks (standard social login logos) ---------- */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.36 12.78c.02 2.5 2.19 3.33 2.21 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.75-.66-1.28 0-1.68.64-2.73.68-1.09.04-1.93-1.1-2.63-2.11-1.42-2.07-2.51-5.84-1.05-8.39.72-1.27 2.01-2.07 3.42-2.09 1.08-.02 2.09.72 2.75.72.66 0 1.9-.89 3.2-.76.54.02 2.07.22 3.05 1.66-.08.05-1.82 1.06-1.8 3.16M14.28 4.65c.58-.71.98-1.7.87-2.68-.84.03-1.86.56-2.47 1.27-.54.62-1.02 1.62-.89 2.57.94.07 1.9-.48 2.49-1.16" />
    </svg>
  )
}

/* floating agriculture illustrations for the brand panel */
const FLOATERS = [
  { Icon: Wheat, className: "left-[10%] top-[16%]", size: "size-6", delay: 0, dur: 6 },
  { Icon: Droplets, className: "left-[16%] top-[64%]", size: "size-5", delay: 1.2, dur: 5.5 },
  { Icon: Tractor, className: "right-[12%] top-[24%]", size: "size-6", delay: 0.5, dur: 6.5 },
  { Icon: CloudSun, className: "right-[18%] top-[62%]", size: "size-5", delay: 1.6, dur: 7.5 },
  { Icon: Sprout, className: "left-[42%] top-[10%]", size: "size-5", delay: 0.9, dur: 6.2 },
]

const HIGHLIGHTS = [
  "Crop planning, advisory & mandi prices",
  "On-demand drones and machinery",
  "Direct market access & fair payments",
]

export function AuthScreen({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter()
  const { login } = useSession()

  const [mode, setMode] = useState<Mode>(initialMode)
  const [step, setStep] = useState<Step>("entry")
  const [regRole, setRegRole] = useState<RegRole>("farmer")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [loading, setLoading] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  const phoneValid = phone.replace(/\D/g, "").length === 10
  const nameValid = mode === "login" || name.trim().length >= 2
  const otpValue = otp.join("")
  const otpComplete = otpValue.length === OTP_LENGTH

  // resend countdown
  useEffect(() => {
    if (resendIn <= 0) return
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  // focus first OTP box when entering that step
  useEffect(() => {
    if (step === "otp") {
      const id = setTimeout(() => otpRefs.current[0]?.focus(), 80)
      return () => clearTimeout(id)
    }
  }, [step])

  function switchMode(next: Mode) {
    setMode(next)
    setStep("entry")
    setOtp(Array(OTP_LENGTH).fill(""))
  }

  function sendOtp() {
    if (!phoneValid || !nameValid) return
    setLoading(true)
    // simulate sending an OTP
    setTimeout(() => {
      setLoading(false)
      setStep("otp")
      setResendIn(RESEND_SECONDS)
    }, 900)
  }

  function handleOtpChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1)
    setOtp((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill("")
    pasted.split("").forEach((d, i) => (next[i] = d))
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  function verifyOtp() {
    if (!otpComplete) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === "register") {
        // register flow knows the role — go straight to that dashboard
        login(regRole)
        router.push("/app/dashboard")
      } else {
        // login flow — continue to workspace selection
        router.push("/app/login")
      }
    }, 900)
  }

  function socialLogin() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/app/login")
    }, 800)
  }

  const heading = useMemo(() => {
    if (step === "otp") return "Verify your number"
    return mode === "login" ? "Welcome back" : "Create your account"
  }, [mode, step])

  const subheading = useMemo(() => {
    if (step === "otp")
      return `Enter the 6-digit code sent to +91 ${phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`
    return mode === "login"
      ? "Log in to your Rythu360 workspace"
      : "Join Rythu360 as a farmer or field operator"
  }, [mode, step, phone])

  return (
    <div className="relative flex min-h-svh bg-background">
      {/* ================= Brand / illustration panel ================= */}
      <aside className="relative hidden w-[45%] max-w-2xl overflow-hidden lg:block">
        {/* green gradient wash */}
        <div className="absolute inset-0 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--primary)_92%,black),var(--primary)_45%,color-mix(in_oklab,var(--primary)_60%,var(--accent)))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_oklab,white_22%,transparent),transparent_45%)]" />

        {/* sun glow */}
        <motion.div
          aria-hidden
          className="absolute right-[14%] top-[12%] size-40 rounded-full bg-accent/40 blur-3xl"
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* rolling hills */}
        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[42%] w-full"
          viewBox="0 0 720 400"
          preserveAspectRatio="none"
        >
          <path d="M0 220 C 160 170 300 260 480 230 C 620 208 680 250 720 232 L720 400 L0 400 Z" fill="rgba(255,255,255,0.10)" />
          <path d="M0 290 C 200 240 320 320 520 296 C 640 282 690 310 720 300 L720 400 L0 400 Z" fill="rgba(0,0,0,0.12)" />
          <path d="M0 350 C 220 320 380 372 620 348 C 680 342 700 356 720 350 L720 400 L0 400 Z" fill="rgba(0,0,0,0.22)" />
        </svg>

        {/* swaying crop row */}
        <div aria-hidden className="absolute inset-x-0 bottom-[5%] flex items-end justify-center gap-2.5 px-8">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="origin-bottom text-white/45"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{
                duration: 3 + (i % 5) * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: (i % 7) * 0.2,
              }}
            >
              <Wheat className="size-6" />
            </motion.div>
          ))}
        </div>

        {/* floating agri illustrations */}
        {FLOATERS.map(({ Icon, className, size, delay, dur }, i) => (
          <motion.div
            key={i}
            aria-hidden
            className={cn(
              "absolute flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-md",
              className,
            )}
            animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: dur, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay }}
          >
            <Icon className={size} />
          </motion.div>
        ))}

        {/* panel copy */}
        <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Leaf className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Rythu<span className="text-accent">360</span>
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight">
              One login for your entire farm.
            </h2>
            <ul className="mt-6 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check className="size-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck className="size-4" />
            Bank-grade security · Your data stays private
          </div>
        </div>
      </aside>

      {/* ================= Auth form panel ================= */}
      <main className="relative flex flex-1 flex-col">
        {/* ambient glow for mobile / right side */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div className="flex items-center justify-between px-5 py-6 sm:px-8 lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Rythu<span className="text-primary">360</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9"
          >
            {/* mode tabs */}
            {step === "entry" && (
              <div className="mb-7 grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1">
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={cn(
                      "relative rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-colors focus-visible:outline-none",
                      mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="authTab"
                        className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{m === "login" ? "Login" : "Register"}</span>
                  </button>
                ))}
              </div>
            )}

            {/* heading */}
            <div className="mb-6">
              {step === "otp" && (
                <button
                  type="button"
                  onClick={() => setStep("entry")}
                  className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{subheading}</p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "entry" ? (
                <motion.div
                  key="entry"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* register: role choice */}
                  {mode === "register" && (
                    <div>
                      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        I am a
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          [
                            { id: "farmer" as RegRole, label: "Farmer", desc: "Grow & sell", Icon: Sprout },
                            { id: "operator" as RegRole, label: "Operator", desc: "Run the fleet", Icon: Tractor },
                          ]
                        ).map(({ id, label, desc, Icon }) => {
                          const active = regRole === id
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setRegRole(id)}
                              aria-pressed={active}
                              className={cn(
                                "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                active
                                  ? "border-primary bg-primary/10"
                                  : "border-border/70 bg-card/60 hover:border-primary/40",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-9 items-center justify-center rounded-xl",
                                  active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                                )}
                              >
                                <Icon className="size-5" />
                              </span>
                              <span className="text-sm font-semibold">{label}</span>
                              <span className="text-xs text-muted-foreground">{desc}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* register: name */}
                  {mode === "register" && (
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                      />
                    </div>
                  )}

                  {/* phone */}
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                      Phone number
                    </label>
                    <div className="flex h-12 items-center gap-2 rounded-2xl border border-input bg-background/60 px-3 transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-ring/30">
                      <span className="flex items-center gap-1.5 border-r border-border pr-2.5 text-sm font-medium text-muted-foreground">
                        <Phone className="size-4" />
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                      {phoneValid && <Check className="size-4 text-primary" />}
                    </div>
                  </div>

                  {/* continue → send OTP */}
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={!phoneValid || !nameValid || loading}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        Continue with OTP
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>

                  {/* divider */}
                  <div className="flex items-center gap-3 py-1">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground">or continue with</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  {/* social logins */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={socialLogin}
                      disabled={loading}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-input bg-background/60 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                    >
                      <GoogleIcon className="size-5" />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={socialLogin}
                      disabled={loading}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-input bg-background/60 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                    >
                      <AppleIcon className="size-5" />
                      Apple
                    </button>
                  </div>

                  <p className="pt-1 text-center text-xs leading-relaxed text-muted-foreground">
                    By continuing you agree to our{" "}
                    <span className="font-medium text-foreground/80">Terms</span> and{" "}
                    <span className="font-medium text-foreground/80">Privacy Policy</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* OTP boxes */}
                  <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        aria-label={`Digit ${i + 1}`}
                        className={cn(
                          "h-14 w-full rounded-2xl border bg-background/60 text-center text-xl font-semibold outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-ring/30",
                          digit ? "border-primary text-foreground" : "border-input text-foreground",
                        )}
                      />
                    ))}
                  </div>

                  {/* verify */}
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={!otpComplete || loading}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        {mode === "register" ? "Create account" : "Verify & continue"}
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>

                  {/* resend */}
                  <div className="text-center text-sm text-muted-foreground">
                    {resendIn > 0 ? (
                      <span>
                        Resend code in <span className="font-medium text-foreground">{resendIn}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResendIn(RESEND_SECONDS)}
                        className="font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    Demo mode · Enter any 6 digits to continue
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
