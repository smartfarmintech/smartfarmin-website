import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this resource.
          </p>
        </div>

        <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 text-sm text-muted-foreground">
          <p>Your current role does not have the required permissions for this action.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
