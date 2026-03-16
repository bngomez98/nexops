import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { store, SERVICE_LABELS } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function ContractorAnalyticsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "contractor") redirect("/dashboard/homeowner");

  const claimed = store.getClaimedByContractor(user.id);

  // Category breakdown
  const byCategory: Record<string, { count: number; value: number }> = {};
  for (const req of claimed) {
    if (!byCategory[req.category]) byCategory[req.category] = { count: 0, value: 0 };
    byCategory[req.category].count++;
    byCategory[req.category].value += req.maxBudget;
  }

  const totalValue = claimed.reduce((s, r) => s + r.maxBudget, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <Link href="/dashboard/contractor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { label: "Projects claimed", value: claimed.length.toString() },
            { label: "Total pipeline value", value: formatCurrency(totalValue) },
            { label: "Avg project value", value: claimed.length > 0 ? formatCurrency(totalValue / claimed.length) : "—" },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* By category */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by category</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(byCategory).length === 0 ? (
              <p className="text-sm text-gray-500">No claimed projects yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(byCategory).map(([cat, data]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{SERVICE_LABELS[cat as keyof typeof SERVICE_LABELS]}</span>
                    <div className="flex gap-6 text-gray-500">
                      <span>{data.count} project{data.count !== 1 ? "s" : ""}</span>
                      <span>{formatCurrency(data.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
