import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, Plus, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const fullName = user?.user_metadata?.full_name || "there"
  const role = user?.user_metadata?.role || "homeowner"

  // If contractor, redirect to contractor portal
  if (role === "contractor") {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">Contractor Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Your contractor portal is coming soon. Contact admin@nexusoperations.org for early access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {fullName}</h1>
          <p className="text-muted-foreground">
            Manage your service requests and track project progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Requests
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Awaiting contractor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Work underway</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State / Get Started */}
        <Card>
          <CardHeader>
            <CardTitle>Get started with your first request</CardTitle>
            <CardDescription>
              Submit a service request and get matched with a verified contractor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">No requests yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first service request to get started
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/requests/new">
                  Create Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { step: "1", title: "Submit", description: "Upload photos and describe your project" },
              { step: "2", title: "Match", description: "A verified contractor claims your request" },
              { step: "3", title: "Consult", description: "Receive a confirmed consultation appointment" },
              { step: "4", title: "Complete", description: "Get an itemized estimate and proceed" },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
