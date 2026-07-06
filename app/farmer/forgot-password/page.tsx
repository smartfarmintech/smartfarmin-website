import { ArrowLeft, Sprout, Send } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Forgot Password | Rythu360",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout className="size-6" />
          </div>
          <CardTitle className="font-serif text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive password reset instructions</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/auth/reset-password" method="POST" className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@example.com"
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Send className="size-4" />
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <Link href="/farmer/login" className="flex items-center gap-2 font-medium text-primary hover:underline">
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Check your email for a password reset link. The link will expire in 1 hour.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
