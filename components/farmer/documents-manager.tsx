"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Plus, ExternalLink, CalendarClock } from "lucide-react"
import { addDocument, type ActionState } from "@/lib/farmer/actions"
import { FARM_DOCUMENT_TYPES, label } from "@/lib/farmer/constants"
import { formatDate, daysUntil } from "@/lib/farmer/format"
import type { FarmDocument, Land } from "@/lib/farmer/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function DocumentsManager({ documents, lands }: { documents: FarmDocument[]; lands: Land[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [docType, setDocType] = useState<string>("land_record")
  const [landId, setLandId] = useState<string>("")
  const [state, formAction] = useActionState<ActionState, FormData>(addDocument, null)

  useEffect(() => {
    if (state?.ok) {
      setOpen(false)
      setDocType("land_record")
      setLandId("")
      router.refresh()
    }
  }, [state, router])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="size-4" />
                Add document
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add document</DialogTitle>
              <DialogDescription>Store a reference to an important farm or identity document.</DialogDescription>
            </DialogHeader>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="documentType" value={docType} />
              <input type="hidden" name="landId" value={landId} />

              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Land patta 2024" />
                {state?.fieldErrors?.title ? (
                  <p className="text-xs text-destructive">{state.fieldErrors.title}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Document type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FARM_DOCUMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {label(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Linked land (optional)</Label>
                  <Select value={landId || "none"} onValueChange={(v) => setLandId(v === "none" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="No land" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No land</SelectItem>
                      {lands.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.land_name || l.survey_number || "Land parcel"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fileUrl">File URL</Label>
                <Input id="fileUrl" name="fileUrl" type="url" required placeholder="https://..." />
                {state?.fieldErrors?.fileUrl ? (
                  <p className="text-xs text-destructive">{state.fieldErrors.fileUrl}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="issuedBy">Issued by</Label>
                  <Input id="issuedBy" name="issuedBy" placeholder="e.g. Revenue Dept" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issueDate">Issue date</Label>
                  <Input id="issueDate" name="issueDate" type="date" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiryDate">Expiry date (optional)</Label>
                <Input id="expiryDate" name="expiryDate" type="date" className="sm:max-w-[220px]" />
              </div>

              {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

              <DialogFooter>
                <SubmitButton>Save document</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <FileText className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No documents yet</p>
          <p className="text-sm text-muted-foreground">Add your land records, identity, and insurance documents.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const expiryDays = daysUntil(doc.expiry_date)
            const expiringSoon = expiryDays != null && expiryDays >= 0 && expiryDays <= 30
            const expired = expiryDays != null && expiryDays < 0
            return (
              <Card key={doc.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {label(doc.document_type)}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc.title}</p>
                  {doc.issued_by ? <p className="text-xs text-muted-foreground">Issued by {doc.issued_by}</p> : null}
                </div>
                <div className="mt-auto space-y-1 text-xs text-muted-foreground">
                  <p>Issued: {formatDate(doc.issue_date)}</p>
                  {doc.expiry_date ? (
                    <p
                      className={`flex items-center gap-1 ${
                        expired ? "text-destructive" : expiringSoon ? "text-amber-600" : ""
                      }`}
                    >
                      <CalendarClock className="size-3" />
                      {expired ? "Expired " : "Expires "}
                      {formatDate(doc.expiry_date)}
                    </p>
                  ) : null}
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View document
                  <ExternalLink className="size-3.5" />
                </a>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
