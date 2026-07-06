"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, FileText, Pencil, Plus, Trash2, Users } from "lucide-react"
import {
  deleteOperator,
  deleteOperatorDocument,
  saveOperator,
  saveOperatorDocument,
} from "@/lib/operator/actions"
import {
  DOC_VERIFICATION_STATUSES,
  OPERATOR_DOC_TYPES,
  OPERATOR_STATUSES,
  label,
} from "@/lib/operator/constants"
import { formatCurrency, formatDate } from "@/lib/operator/format"
import type { Operator, OperatorDocument } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "./status-badge"

const EMPTY = {
  id: "",
  fullName: "",
  phone: "",
  operatorStatus: "active",
  yearsExperience: "",
  dailyWage: "",
  skills: "",
}

const EMPTY_DOC = {
  operatorId: "",
  docType: "driving_license",
  verificationStatus: "pending",
  documentNumber: "",
  issuedOn: "",
  expiresOn: "",
}

export function OperatorsManager({
  initialOperators,
  documents,
}: {
  initialOperators: Operator[]
  documents: OperatorDocument[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [docOpen, setDocOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [docForm, setDocForm] = useState({ ...EMPTY_DOC })

  const docsByOperator = useMemo(() => {
    const map = new Map<string, OperatorDocument[]>()
    for (const d of documents) {
      const arr = map.get(d.operator_id) ?? []
      arr.push(d)
      map.set(d.operator_id, arr)
    }
    return map
  }, [documents])

  function openAdd() {
    setForm({ ...EMPTY })
    setError(null)
    setOpen(true)
  }

  function openEdit(o: Operator) {
    setForm({
      id: o.id,
      fullName: o.full_name,
      phone: o.phone ?? "",
      operatorStatus: o.operator_status,
      yearsExperience: o.years_experience != null ? String(o.years_experience) : "",
      dailyWage: o.daily_wage != null ? String(o.daily_wage) : "",
      skills: o.skills.join(", "),
    })
    setError(null)
    setOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    if (form.id) fd.set("id", form.id)
    fd.set("fullName", form.fullName)
    fd.set("phone", form.phone)
    fd.set("operatorStatus", form.operatorStatus)
    fd.set("yearsExperience", form.yearsExperience)
    fd.set("dailyWage", form.dailyWage)
    fd.set("skills", form.skills)
    startTransition(async () => {
      const res = await saveOperator(null, fd)
      if (res?.ok) {
        setOpen(false)
        router.refresh()
      } else {
        setError(res?.error ?? Object.values(res?.fieldErrors ?? {})[0] ?? "Something went wrong")
      }
    })
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteOperator(id)
      if (res?.ok) router.refresh()
    })
  }

  function openDoc(operatorId: string) {
    setDocForm({ ...EMPTY_DOC, operatorId })
    setError(null)
    setDocOpen(true)
  }

  function submitDoc(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.set("operatorId", docForm.operatorId)
    fd.set("docType", docForm.docType)
    fd.set("verificationStatus", docForm.verificationStatus)
    fd.set("documentNumber", docForm.documentNumber)
    fd.set("issuedOn", docForm.issuedOn)
    fd.set("expiresOn", docForm.expiresOn)
    startTransition(async () => {
      const res = await saveOperatorDocument(null, fd)
      if (res?.ok) {
        setDocOpen(false)
        router.refresh()
      } else {
        setError(res?.error ?? Object.values(res?.fieldErrors ?? {})[0] ?? "Something went wrong")
      }
    })
  }

  function removeDoc(id: string) {
    startTransition(async () => {
      const res = await deleteOperatorDocument(id)
      if (res?.ok) router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Operators</h1>
          <p className="text-sm text-muted-foreground">Manage your crew and their verification documents.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" aria-hidden /> Add operator
        </Button>
      </div>

      {initialOperators.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Users className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No operators yet. Add your first crew member.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {initialOperators.map((o) => {
            const docs = docsByOperator.get(o.id) ?? []
            return (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {o.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate font-medium text-card-foreground">
                        {o.full_name}
                        {o.is_verified && <BadgeCheck className="size-4 text-primary" aria-label="Verified" />}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{o.phone || "No phone"}</p>
                    </div>
                  </div>
                  <StatusBadge value={o.operator_status} />
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Experience</dt>
                    <dd className="font-medium text-foreground">
                      {o.years_experience != null ? `${o.years_experience} yr` : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Daily wage</dt>
                    <dd className="font-medium text-foreground">
                      {o.daily_wage != null ? formatCurrency(o.daily_wage) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd className="font-medium text-foreground">
                      {o.rating_count > 0 ? `★ ${o.rating_avg.toFixed(1)}` : "—"}
                    </dd>
                  </div>
                </dl>

                {o.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {o.skills.map((s) => (
                      <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {docs.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {docs.map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                          <FileText className="size-3.5 shrink-0" aria-hidden />
                          <span className="truncate">
                            {label(d.doc_type)}
                            {d.expires_on ? ` · exp ${formatDate(d.expires_on)}` : ""}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <StatusBadge value={d.verification_status} />
                          <button
                            type="button"
                            onClick={() => removeDoc(d.id)}
                            className="text-destructive hover:underline"
                            aria-label="Remove document"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                  <Button size="sm" variant="outline" onClick={() => openDoc(o.id)}>
                    <FileText className="size-4" aria-hidden /> Add document
                  </Button>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(o)} aria-label={`Edit ${o.full_name}`}>
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(o.id)}
                      disabled={isPending}
                      aria-label={`Delete ${o.full_name}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Operator dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit operator" : "Add operator"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="o-name">Full name</Label>
              <Input
                id="o-name"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="o-phone">Phone</Label>
                <Input
                  id="o-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.operatorStatus}
                  onValueChange={(v) => setForm((f) => ({ ...f, operatorStatus: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATOR_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {label(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="o-exp">Experience (yrs)</Label>
                <Input
                  id="o-exp"
                  type="number"
                  value={form.yearsExperience}
                  onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="o-wage">Daily wage (₹)</Label>
                <Input
                  id="o-wage"
                  type="number"
                  value={form.dailyWage}
                  onChange={(e) => setForm((f) => ({ ...f, dailyWage: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="o-skills">Skills</Label>
              <Input
                id="o-skills"
                value={form.skills}
                onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                placeholder="Comma separated, e.g. Harvesting, Ploughing"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {form.id ? "Save changes" : "Add operator"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document dialog */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add document</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitDoc} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={docForm.docType} onValueChange={(v) => setDocForm((f) => ({ ...f, docType: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATOR_DOC_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {label(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Verification</Label>
                <Select
                  value={docForm.verificationStatus}
                  onValueChange={(v) => setDocForm((f) => ({ ...f, verificationStatus: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_VERIFICATION_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {label(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-num">Document number</Label>
              <Input
                id="d-num"
                value={docForm.documentNumber}
                onChange={(e) => setDocForm((f) => ({ ...f, documentNumber: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="d-issued">Issued on</Label>
                <Input
                  id="d-issued"
                  type="date"
                  value={docForm.issuedOn}
                  onChange={(e) => setDocForm((f) => ({ ...f, issuedOn: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-exp">Expires on</Label>
                <Input
                  id="d-exp"
                  type="date"
                  value={docForm.expiresOn}
                  onChange={(e) => setDocForm((f) => ({ ...f, expiresOn: e.target.value }))}
                />
              </div>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDocOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Add document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
