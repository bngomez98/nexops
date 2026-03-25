import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl overflow-hidden">
        <div className="relative h-40 w-full border-b border-border">
          <Image src="/photo-home.jpg" alt="Nexus Operations property overview" fill className="object-cover" priority />
        </div>
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={160} height={53} style={{ height: "48px", width: "auto" }} />
          </Link>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            Your account request is in progress. Open your inbox and click the confirmation link to activate secure access.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check spam or <Link href="/auth/sign-up" className="text-primary hover:underline">submit your registration again</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
