"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import type { ActionState } from "@/lib/operator/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ConfirmDelete({
  onConfirm,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  label = "Delete",
  triggerLabel,
}: {
  onConfirm: () => Promise<ActionState>
  title?: string
  description?: string
  label?: string
  triggerLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const res = await onConfirm()
      if (res && !res.ok) {
        setError(res.error ?? "Something went wrong")
        return
      }
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerLabel ? (
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="size-4" aria-hidden />
            {triggerLabel}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={label}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending ? "Deleting…" : label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
