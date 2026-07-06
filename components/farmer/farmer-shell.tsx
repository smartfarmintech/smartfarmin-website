"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Sprout,
  Wallet,
  CloudSun,
  User,
  Wrench,
  Calendar,
} from "lucide-react"
import { logoutFarmer } from "@/lib/farmer/actions"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { OfflineIndicator } from "./offline-indicator"

const NAV = [
  { href: "/farmer", label: "Overview", icon: LayoutDashboard },
  { href: "/farmer/crops", label: "My Crops", icon: Sprout },
  { href: "/farmer/machinery", label: "Machinery", icon: Wrench },
  { href: "/farmer/bookings", label: "My Bookings", icon: Calendar },
  { href: "/farmer/weather", label: "Weather", icon: CloudSun },
  { href: "/farmer/finance", label: "Finance", icon: Wallet },
  { href: "/farmer/documents", label: "Documents", icon: FileText },
  { href: "/farmer/notifications", label: "Alerts", icon: Bell },
  { href: "/farmer/profile", label: "Profile", icon: User },
]

// Mobile bottom-nav shows the 5 most-used destinations.
const MOBILE_NAV = NAV.filter(
  (n) =>
    !["/farmer/documents", "/farmer/profile", "/farmer/weather"].includes(n.href),
).slice(0, 5)

function isActive(pathname: string, href: string) {
  if (href === "/farmer") return pathname === "/farmer"
  return pathname.startsWith(href)
}

export function FarmerShell({
  children,
  displayName,
  unreadCount,
}: {
  children: React.ReactNode
  displayName: string
  unreadCount: number
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-svh bg-secondary/30">
      <div className="mx-auto flex w-full max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-5 md:flex">
          <Link href="/farmer" className="mb-6 flex items-center gap-2 px-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sprout className="size-5" aria-hidden />
            </span>
            <span className="font-serif text-lg font-semibold">Rythu360</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1" aria-label="Farmer navigation">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </span>
                  {href === "/farmer/notifications" && unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 justify-center px-1.5">{unreadCount}</Badge>
                  )}
                </Link>
              )
            })}
          </nav>
          <form action={logoutFarmer}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sprout className="size-4" aria-hidden />
              </span>
              <span className="font-serif text-base font-semibold">Rythu360</span>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              Welcome back, <span className="font-medium text-foreground">{displayName}</span>
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/farmer/notifications"
                className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              >
                <Bell className="size-5" aria-hidden />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex size-2 rounded-full bg-accent" aria-hidden />
                )}
              </Link>
            </div>
          </header>

          <OfflineIndicator />

          <main className="flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-8">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background md:hidden"
        aria-label="Farmer navigation"
      >
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon className="size-5" aria-hidden />
                {href === "/farmer/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex size-2 rounded-full bg-accent" aria-hidden />
                )}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
