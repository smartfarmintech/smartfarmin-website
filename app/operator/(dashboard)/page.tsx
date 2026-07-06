import Link from "next/link"
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  IndianRupee,
  Star,
  Tractor,
  Users,
} from "lucide-react"
import { requireOwner } from "@/lib/operator/queries"
import { getBookings, getDashboardStats } from "@/lib/operator/queries"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/operator/format"
import { StatCard } from "@/components/operator/stat-card"
import { StatusBadge } from "@/components/operator/status-badge"

export default async function OperatorOverviewPage() {
  const { userId } = await requireOwner()
  const [stats, bookings] = await Promise.all([getDashboardStats(userId), getBookings(userId)])

  const recent = bookings.slice(0, 6)
  const pending = bookings.filter((b) => b.booking_state === "requested").slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">A snapshot of your machinery rental business.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Machines"
          value={stats.machineCount}
          icon={Tractor}
          hint={`${stats.activeMachines} active`}
        />
        <StatCard
          label="Active bookings"
          value={stats.activeBookings}
          icon={ClipboardList}
          hint={`${stats.pendingRequests} awaiting review`}
        />
        <StatCard
          label="Revenue (MTD)"
          value={formatCurrency(stats.monthRevenue)}
          icon={IndianRupee}
          hint="Completed jobs this month"
        />
        <StatCard
          label="Rating"
          value={stats.ratingCount > 0 ? stats.ratingAvg.toFixed(1) : "—"}
          icon={Star}
          hint={`${formatNumber(stats.ratingCount)} reviews`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Crew operators" value={stats.operatorCount} icon={Users} />
        <StatCard label="Pending requests" value={stats.pendingRequests} icon={CalendarClock} />
      </div>

      {pending.length > 0 && (
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-card-foreground">Requests needing action</h2>
            <Link
              href="/operator/bookings"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {pending.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/operator/bookings/${b.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {b.machine?.name ?? "Machine"} · {b.booking_number}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(b.starts_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{formatCurrency(b.total_amount)}</span>
                    <StatusBadge value={b.booking_state} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-card-foreground">Recent bookings</h2>
          <Link
            href="/operator/bookings"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No bookings yet. Once renters book your machines, they will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/operator/bookings/${b.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {b.machine?.name ?? "Machine"} · {b.booking_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(b.starts_at)} → {formatDateTime(b.ends_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge value={b.payment_status} />
                    <StatusBadge value={b.booking_state} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
