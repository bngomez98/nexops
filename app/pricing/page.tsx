import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Standard",
    price: "$299",
    description: "Everything you need to grow your business",
    highlight: false,
    features: [
      "Full project feed access",
      "Unlimited project claims",
      "First-come, first-served",
      "Full project documentation before claiming",
      "Performance dashboard",
      "No annual contracts",
      "Cancel anytime",
    ],
  },
  {
    name: "Premium",
    price: "$499",
    description: "Get notified before the field",
    highlight: true,
    features: [
      "Everything in Standard",
      "90-second advance notification window",
      "Priority project alerts",
      "Full project documentation before claiming",
      "Performance dashboard",
      "No annual contracts",
      "Cancel anytime",
    ],
  },
  {
    name: "Elite",
    price: "$749",
    description: "Exclusive access to high-value projects",
    highlight: false,
    features: [
      "Everything in Premium",
      "10-minute exclusive window on $5K+ projects",
      "No competition on large projects",
      "Full project documentation before claiming",
      "Performance dashboard",
      "No annual contracts",
      "Cancel anytime",
    ],
  },
];

export default async function PricingPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">Contractor membership</h1>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Flat monthly fee. Unlimited project claims. No per-lead fees, no surprises.
              </p>
              <Badge className="mt-4 bg-green-100 text-green-800 border-green-200">
                Free for homeowners — always
              </Badge>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative ${tier.highlight ? "border-blue-600 shadow-lg ring-2 ring-blue-600" : ""}`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup?role=contractor">
                      <Button
                        className="w-full"
                        variant={tier.highlight ? "default" : "outline"}
                      >
                        Get started with {tier.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-12 text-center text-sm text-gray-400">
              All plans include full project documentation before committing. No annual contracts.
              Cancel anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
