"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { topUpWallet, type ActionState } from "@/lib/farmer/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubmitButton } from "./submit-button"

const QUICK_AMOUNTS = [100, 500, 1000, 2000]

export function TopUpDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [state, formAction] = useActionState<ActionState, FormData>(topUpWallet, null)

  useEffect(() => {
    if (state?.ok) {
      setOpen(false)
      setAmount("")
      router.refresh()
    }
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Add money
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add money to wallet</DialogTitle>
          <DialogDescription>Top up your wallet balance to pay for orders and services.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={1}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            {state?.fieldErrors?.amount ? (
              <p className="text-xs text-destructive">{state.fieldErrors.amount}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(String(amt))}
              >
                ₹{amt}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Note (optional)</Label>
            <Input id="description" name="description" placeholder="e.g. Seed purchase" />
          </div>

          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <DialogFooter>
            <SubmitButton>Add money</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
