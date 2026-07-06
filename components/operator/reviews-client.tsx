"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Star } from "lucide-react"
import { respondToReview } from "@/lib/operator/actions"
import { formatDate } from "@/lib/operator/format"
import type { MachineReview } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./status-badge"
import { EmptyState } from "./empty-state"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("size-4", n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
          aria-hidden
        />
      ))}
    </span>
  )
}

function ReviewCard({ review }: { review: MachineReview }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [response, setResponse] = useState(review.owner_response ?? "")
  const [error, setError] = useState<string | null>(null)

  function submit() {
    setError(null)
    startTransition(async () => {
      const res = await respondToReview(review.id, response)
      if (res?.ok) {
        setEditing(false)
        router.refresh()
      } else {
        setError(res?.error ?? "Something went wrong")
      }
    })
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Stars rating={review.rating} />
            <span className="text-xs text-muted-foreground">{review.machine?.name ?? "Machine"}</span>
            {review.is_verified_booking && <StatusBadge value="verified" tone="success" />}
          </div>
          {review.title ? <p className="mt-1.5 font-medium text-card-foreground">{review.title}</p> : null}
          {review.body ? <p className="mt-1 text-sm text-muted-foreground">{review.body}</p> : null}
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
        </div>
        <StatusBadge value={review.review_status} />
      </div>

      {review.owner_response && !editing ? (
        <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
          <p className="text-xs font-medium text-foreground">Your response</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{review.owner_response}</p>
          <Button variant="ghost" size="sm" className="mt-1 h-7 px-2" onClick={() => setEditing(true)}>
            Edit response
          </Button>
        </div>
      ) : editing ? (
        <div className="mt-3 space-y-2">
          <Textarea
            rows={3}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write a public response…"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex gap-2">
            <Button size="sm" onClick={submit} disabled={isPending || !response.trim()}>
              {isPending ? "Saving…" : "Post response"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setEditing(true)}>
          <MessageSquare className="size-4" aria-hidden /> Respond
        </Button>
      )}
    </Card>
  )
}

export function ReviewsClient({ initialReviews }: { initialReviews: MachineReview[] }) {
  const { avg, count } = useMemo(() => {
    if (initialReviews.length === 0) return { avg: 0, count: 0 }
    const total = initialReviews.reduce((sum, r) => sum + r.rating, 0)
    return { avg: total / initialReviews.length, count: initialReviews.length }
  }, [initialReviews])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground">Feedback from renters across your fleet.</p>
        </div>
        {count > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <span className="text-2xl font-semibold text-foreground">{avg.toFixed(1)}</span>
            <div>
              <Stars rating={Math.round(avg)} />
              <p className="text-xs text-muted-foreground">{count} review{count === 1 ? "" : "s"}</p>
            </div>
          </div>
        )}
      </div>

      {initialReviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Once renters complete bookings, their reviews will show up here."
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {initialReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  )
}
