import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl overflow-hidden text-center">
        <div className="relative h-40 w-full border-b border-border">
          <Image src="/photo-work.jpg" alt="Contractor completing a property project" fill className="object-cover" priority />
        </div>
        <CardHeader>
          <Link href="/" className="mx-auto mb-4">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={160} height={53} style={{ height: "48px", width: "auto" }} />
          </Link>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            We couldn&apos;t verify this authentication session. The link may be expired, used, or malformed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/auth/login">Try signing in again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/forgot-password">Reset password</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
