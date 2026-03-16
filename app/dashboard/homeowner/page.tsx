import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, DollarSign, Calendar } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning"> = {
  open: "warning",
  claimed: "success",
  completed: "default",
  cancelled: "secondary",
};

export default async function HomeownerDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "homeowner") redirect("/dashboard/contractor");

  const requests = store.getRequestsByHomeowner(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Projects</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/homeowner/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New request
              </Button>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit"
                onClick={async (e) => {
                  // client-side handled in navbar; fallback
                }}>
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Total requests", value: requests.length },
            { label: "Open", value: requests.filter((r) => r.status === "open").length },
            { label: "Claimed", value: requests.filter((r) => r.status === "claimed").length },
            { label: "Completed", value: requests.filter((r) => r.status === "completed").length },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requests list */}
        {requests.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <p className="text-gray-500 mb-4">You haven&apos;t submitted any requests yet.</p>
              <Link href="/dashboard/homeowner/new">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Submit your first request
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{req.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {SERVICE_LABELS[req.category]}
                      </p>
                    </div>
                    <Badge variant={statusVariant[req.status] ?? "secondary"}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{req.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {req.address}, {req.city}, {req.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      Max budget: {formatCurrency(req.maxBudget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(req.createdAt)}
                    </span>
                  </div>
                  {req.status === "claimed" && (
                    <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
                      A contractor has claimed this project and will be in touch within 24 hours.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
