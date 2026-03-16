import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, DollarSign, Clock, FileText, BarChart } from "lucide-react";

const benefits = [
  {
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    title: "No per-lead fees",
    description: "One flat monthly fee. Claim as many projects as you want. No surprises.",
  },
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: "Full documentation upfront",
    description: "See photos, written scope, and max budget before you claim. No mystery leads.",
  },
  {
    icon: <Clock className="h-6 w-6 text-orange-500" />,
    title: "Exclusive claims",
    description: "Once you claim a project, it's yours. Removed from all other contractors instantly.",
  },
  {
    icon: <BarChart className="h-6 w-6 text-purple-600" />,
    title: "Performance dashboard",
    description: "Track your claims, revenue, and metrics in one place.",
  },
];

const requirements = [
  "Valid state contractor license",
  "Proof of general liability insurance",
  "Active business entity (LLC, sole prop, etc.)",
  "Service area in or near Topeka, KS",
];

export default async function ContractorsPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Built for serious contractors</h1>
            <p className="mt-6 text-xl text-gray-300">
              Stop paying per lead. One flat monthly fee, unlimited project claims,
              and full project details before you commit.
            </p>
            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <Link href="/signup?role=contractor">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Join now</Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">Why NexOps?</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {benefits.map((b) => (
                <Card key={b.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {b.icon}
                      <CardTitle className="text-lg">{b.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">Requirements</h2>
            <p className="mt-4 text-center text-gray-500">
              We verify every contractor before activating their account.
            </p>
            <ul className="mt-10 space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-center gap-3 text-gray-700">
                  <Check className="h-5 w-5 text-green-600 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              <Link href="/signup?role=contractor">
                <Button size="lg">Apply now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
