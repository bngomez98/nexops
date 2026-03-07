import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"

export default function RequestsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">View and manage your service requests</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No requests yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first service request to get matched with a contractor
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/requests/new">Create Request</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
