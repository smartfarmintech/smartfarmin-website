"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Bell, Leaf, LogOut, Menu, Search, Settings, Sprout, X } from "lucide-react"
import { getRole } from "@/lib/agreeConnect/roles"
import { useSession } from "@/components/rythu360/session-provider"
import { ThemeToggle } from "@/components/agreeConnect/theme-toggle"
import { FarmerDashboard } from "@/components/agreeConnect/farmer-dashboard"
import { RolePlaceholder } from "@/components/agreeConnect/role-placeholder"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppShell() {
  const router = useRouter()
  const { roleId, ready, logout } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("Overview")

  const role = useMemo(() => getRole(roleId), [roleId])

  useEffect(() => {
    if (ready && !roleId) router.replace("/app/login")
  }, [ready, roleId, router])

  if (!ready || !role) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Sprout className="size-8 animate-pulse text-primary" />
          <p className="text-sm">Loading workspace…</p>
        </div>
      </div>
    )
  }

  function handleLogout() {
    logout()
    router.replace("/app/login")
  }

  const RoleIcon = role.icon

  return (
    <div className="min-h-svh bg-background">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1600px]">
        {/* ---------- Desktop sidebar ---------- */}
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar/60 px-3 py-4 backdrop-blur-xl lg:flex">
          <SidebarContent
            role={role}
            active={active}
            onSelect={setActive}
            onLogout={handleLogout}
          />
        </aside>

        {/* ---------- Mobile drawer ---------- */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 26, stiffness: 240 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-sidebar px-3 py-4 lg:hidden"
              >
                <div className="mb-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <SidebarContent
                  role={role}
                  active={active}
                  onSelect={(v) => {
                    setActive(v)
                    setMobileOpen(false)
                  }}
                  onLogout={handleLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ---------- Main column ---------- */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </Button>

            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-2 sm:flex sm:w-72">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crops, orders, farmers…"
                aria-label="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative rounded-full"
                render={<Link href="/app/notifications" />}
                nativeButton={false}
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-background" />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Settings"
                className="rounded-full"
                render={<Link href="/app/settings" />}
                nativeButton={false}
              >
                <Settings className="size-4" />
              </Button>
              <Link
                href="/app/profile"
                aria-label="Open profile"
                className="ml-1 flex items-center gap-2.5 rounded-full border border-border/70 bg-card/60 py-1 pl-1 pr-3 transition-colors hover:bg-card"
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full",
                    role.accent,
                  )}
                >
                  <RoleIcon className="size-4" />
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-medium">Demo {role.label}</p>
                  <p className="text-[11px] text-muted-foreground">SmartFarmin</p>
                </div>
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {role.id === "farmer" ? (
              <FarmerDashboard active={active} />
            ) : (
              <RolePlaceholder role={role} active={active} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({
  role,
  active,
  onSelect,
  onLogout,
}: {
  role: NonNullable<ReturnType<typeof getRole>>
  active: string
  onSelect: (value: string) => void
  onLogout: () => void
}) {
  return (
    <>
      <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Leaf className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Rythu<span className="text-primary">360</span>
        </span>
      </Link>

      <div className="mt-2 rounded-2xl border border-border/70 bg-card/50 px-3 py-2.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Workspace
        </p>
        <p className="text-sm font-semibold">{role.label}</p>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
        {role.nav.map((item) => {
          const Icon = item.icon
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </>
  )
}
