import { MachineRegistrationForm } from "@/components/enterprise/machine-registration-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Register Machine | Fleet Management",
  description: "Register a new agricultural machine to your fleet",
}

export default function RegisterMachinePage() {
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/enterprise/fleet">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Register New Machine</h1>
          <p className="text-muted-foreground mt-2">Add agricultural equipment to your fleet inventory</p>
        </div>
      </div>

      {/* Form */}
      <MachineRegistrationForm />
    </div>
  )
}
