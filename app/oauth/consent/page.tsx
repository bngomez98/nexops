"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react"

export default function OAuthConsentPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OAuth parameters from Stripe
  const state = searchParams.get("state")
  const scope = searchParams.get("scope")
  const clientId = searchParams.get("client_id")
  const responseType = searchParams.get("response_type")
  const redirectUri = searchParams.get("redirect_uri")

  // Check for OAuth callback response (code or error)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  useEffect(() => {
    // If we have a code, process the OAuth callback
    if (code && state) {
      handleOAuthCallback(code, state)
    }
    // If there's an OAuth error, display it
    if (oauthError) {
      setError(errorDescription || oauthError)
    }
  }, [code, state, oauthError, errorDescription])

  async function handleOAuthCallback(authCode: string, oauthState: string) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: authCode, state: oauthState }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to complete OAuth authorization")
        return
      }

      // Redirect to success page
      window.location.href = "/dashboard/contractor/settings?connect=success"
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAuthorize() {
    if (!clientId || !redirectUri || !state) {
      setError("Missing required OAuth parameters")
      return
    }

    setIsLoading(true)

    // Build the Stripe OAuth authorization URL
    const stripeOAuthUrl = new URL("https://connect.stripe.com/oauth/authorize")
    stripeOAuthUrl.searchParams.set("response_type", responseType || "code")
    stripeOAuthUrl.searchParams.set("client_id", clientId)
    stripeOAuthUrl.searchParams.set("scope", scope || "read_write")
    stripeOAuthUrl.searchParams.set("redirect_uri", redirectUri)
    stripeOAuthUrl.searchParams.set("state", state)

    // Redirect to Stripe
    window.location.href = stripeOAuthUrl.toString()
  }

  function handleDeny() {
    // Redirect back with error
    if (redirectUri && state) {
      const denyUrl = new URL(redirectUri)
      denyUrl.searchParams.set("error", "access_denied")
      denyUrl.searchParams.set("error_description", "The user denied your request")
      denyUrl.searchParams.set("state", state)
      window.location.href = denyUrl.toString()
    } else {
      window.location.href = "/dashboard/contractor/settings"
    }
  }

  // Show loading state during callback processing
  if (code && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Completing authorization...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show success state after callback
  if (code && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authorization Complete</h2>
            <p className="text-muted-foreground text-center">
              Your Stripe account has been connected successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Connect Your Stripe Account</CardTitle>
          <CardDescription>
            Nexus Operations is requesting permission to connect to your Stripe account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">This will allow Nexus Operations to:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Process payments on your behalf</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Transfer funds to your bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>View your account information</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By clicking Authorize, you agree to Stripe&apos;s{" "}
              <a
                href="https://stripe.com/connect-account/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Connected Account Agreement
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDeny}
              disabled={isLoading}
            >
              Deny
            </Button>
            <Button
              className="flex-1"
              onClick={handleAuthorize}
              disabled={isLoading || !clientId}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authorizing...
                </>
              ) : (
                "Authorize"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
