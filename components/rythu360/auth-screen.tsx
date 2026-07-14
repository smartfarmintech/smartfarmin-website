"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
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
type Step = "entry"
type RegRole = "farmer" | "operator"

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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [mandal, setMandal] = useState("")
  const [village, setVillage] = useState("")
  const [district, setDistrict] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const phoneValid = phone.replace(/\D/g, "").length === 10
  const nameValid =
    mode === "login" || (firstName.trim().length >= 2 && lastName.trim().length >= 2)
  const locationValid =
    mode === "login" || (mandal !== "" && village !== "" && district !== "")
  const emailValid = email.includes("@")
  const passwordValid = password.length >= 6

  function switchMode(next: Mode) {
    setMode(next)
    setStep("entry")
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setPhone("")
    setMandal("")
    setVillage("")
    setDistrict("")
  }

  function handleLogin() {
    if (!phoneValid || !passwordValid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate login with farmer role
      login("farmer")
      router.push("/dashboard")
    }, 900)
  }

  function handleRegister() {
    if (!nameValid || !phoneValid || !emailValid || !passwordValid || !locationValid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Register successful - login the user
      login(regRole)
      router.push("/dashboard")
    }, 900)
  }

  const heading = useMemo(() => {
    return mode === "login" ? "Welcome back" : "Create your account"
  }, [mode])

  const subheading = useMemo(() => {
    return mode === "login"
      ? "Log in to your Rythu360 workspace"
      : "Join Rythu360 as a farmer or field operator"
  }, [mode])

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

                {/* register form fields */}
                {mode === "register" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
                          First name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Ramesh"
                          className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
                          Last name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Kumar"
                          className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. farmer@example.com"
                        className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="mandal" className="mb-1.5 block text-sm font-medium">
                          Mandal
                        </label>
                        <select
                          id="mandal"
                          value={mandal}
                          onChange={(e) => setMandal(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-ring/30"
                        >
                          <option value="">Select mandal</option>
                          <option value="mandal-a">Mandhal A</option>
                          <option value="mandal-b">Mandhal B</option>
                          <option value="mandal-c">Mandhal C</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="village" className="mb-1.5 block text-sm font-medium">
                          Village
                        </label>
                        <select
                          id="village"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-ring/30"
                        >
                          <option value="">Select village</option>
                          <option value="village-1">Village 1</option>
                          <option value="village-2">Village 2</option>
                          <option value="village-3">Village 3</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="district" className="mb-1.5 block text-sm font-medium">
                          District
                        </label>
                        <select
                          id="district"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-ring/30"
                        >
                          <option value="">Select district</option>
                          <option value="district-x">District X</option>
                          <option value="district-y">District Y</option>
                          <option value="district-z">District Z</option>
                        </select>
                      </div>
                    </div>
                  </>
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

                {/* password (login only) */}
                {mode === "login" && (
                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                    />
                  </div>
                )}

                {/* password (register only) */}
                {mode === "register" && (
                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/30"
                    />
                  </div>
                )}

                {/* submit button */}
                <button
                  type="button"
                  onClick={mode === "login" ? handleLogin : handleRegister}
                  disabled={
                    mode === "login"
                      ? !phoneValid || !passwordValid || loading
                      : !nameValid || !phoneValid || !emailValid || !passwordValid || !locationValid || loading
                  }
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                {/* toggle mode link */}
                <div className="pt-2 text-center text-sm">
                  {mode === "login" ? (
                    <p className="text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>

                <p className="pt-1 text-center text-xs leading-relaxed text-muted-foreground">
                  By continuing you agree to our{" "}
                  <span className="font-medium text-foreground/80">Terms</span> and{" "}
                  <span className="font-medium text-foreground/80">Privacy Policy</span>.
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
