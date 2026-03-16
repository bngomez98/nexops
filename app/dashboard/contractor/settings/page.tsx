import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const tierPrices = { standard: "$299/mo", premium: "$499/mo", elite: "$749/mo" };

export default async function ContractorSettingsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "contractor") redirect("/dashboard/homeowner");

  const tier = (user.membershipTier ?? "standard") as keyof typeof tierPrices;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Link href="/dashboard/contractor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.company && (
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{user.company}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            {user.licenseNumber && (
              <div>
                <p className="text-sm text-gray-500">License number</p>
                <p className="font-medium">{user.licenseNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium capitalize">{tier} plan</p>
                <p className="text-sm text-gray-500">{tierPrices[tier]}</p>
              </div>
              <Badge variant={user.membershipActive ? "success" : "secondary"}>
                {user.membershipActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Link href="/pricing">
              <Button variant="outline" size="sm">View all plans</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
