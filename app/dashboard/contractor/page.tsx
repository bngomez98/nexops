import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, DollarSign, Calendar, Settings } from "lucide-react";
import { ClaimButton } from "@/components/claim-button";

export default async function ContractorDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "contractor") redirect("/dashboard/homeowner");

  const leads = store.getOpenRequests();
  const claimed = store.getClaimedByContractor(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Contractor Dashboard</h1>
            <p className="text-sm text-gray-500">
              {user.company ?? user.name} ·{" "}
              <span className="capitalize">{user.membershipTier ?? "standard"}</span> member
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/contractor/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Available leads", value: leads.length },
            { label: "Claimed projects", value: claimed.length },
            { label: "Value claimed", value: formatCurrency(claimed.reduce((s, r) => s + r.maxBudget, 0)) },
            { label: "Membership", value: user.membershipTier ?? "Standard" },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-gray-900 capitalize">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="leads">
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Available leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="claimed">My projects ({claimed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            {leads.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500">No open projects available right now. Check back soon.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{lead.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{SERVICE_LABELS[lead.category]}</p>
                        </div>
                        <Badge variant="warning">Open</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{lead.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {lead.city}, {lead.state} {lead.zip}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          Max budget: {formatCurrency(lead.maxBudget)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Posted {formatDate(lead.createdAt)}
                        </span>
                      </div>
                      <ClaimButton requestId={lead.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="claimed">
            {claimed.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500">You haven&apos;t claimed any projects yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {claimed.map((req) => (
                  <Card key={req.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{req.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{SERVICE_LABELS[req.category]}</p>
                        </div>
                        <Badge variant="success">Claimed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{req.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {req.address}, {req.city}, {req.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          Max: {formatCurrency(req.maxBudget)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Claimed {req.claimedAt ? formatDate(req.claimedAt) : "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
