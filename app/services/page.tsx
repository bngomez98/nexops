import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    name: "Tree Removal",
    range: "$500 – $8,000",
    description:
      "Safe removal of trees of all sizes, including stumps. Licensed arborists handle complex jobs near structures or utilities.",
    typical: ["Single tree removal", "Storm damage cleanup", "Stump grinding", "Lot clearing"],
  },
  {
    name: "Concrete Work",
    range: "$1,200 – $15,000",
    description:
      "Driveways, sidewalks, patios, and foundations. Permits pulled when required.",
    typical: ["Driveway replacement", "Patio installation", "Sidewalk repair", "Foundation work"],
  },
  {
    name: "Roofing",
    range: "$300 – $25,000",
    description:
      "Full roof replacements, repairs, and insurance claim work. Shingle, metal, and flat roofing.",
    typical: ["Full replacement", "Storm damage repair", "Insurance claims", "Flat roof coating"],
  },
  {
    name: "HVAC",
    range: "$3,000 – $20,000",
    description:
      "System installations, replacements, and maintenance for heating and cooling.",
    typical: ["New system install", "Furnace replacement", "AC replacement", "Duct repair"],
  },
  {
    name: "Fencing",
    range: "$1,500 – $8,000",
    description:
      "Privacy, decorative, and security fencing in wood, vinyl, and metal.",
    typical: ["Privacy fence", "Chain link", "Vinyl fence", "Gate installation"],
  },
  {
    name: "Electrical",
    range: "$500 – $10,000",
    description:
      "Panel upgrades, outlet work, lighting, and EV charger installations. Licensed electricians only.",
    typical: ["Panel upgrade", "EV charger install", "Outlet addition", "Lighting upgrade"],
  },
  {
    name: "Plumbing",
    range: "TBD",
    description:
      "Water heaters, pipe repair, drain work, and fixture installations. Licensed plumbers.",
    typical: ["Water heater", "Leak repair", "Drain cleaning", "Fixture install"],
  },
  {
    name: "Excavation",
    range: "TBD",
    description:
      "Grading, trenching, and site preparation for new construction or drainage projects.",
    typical: ["Land grading", "Trenching", "Pond excavation", "Site prep"],
  },
];

export default async function ServicesPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      <main className="flex-1">
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-gray-900">Service categories</h1>
            <p className="mt-4 text-lg text-gray-500">
              Available in Topeka, KS and surrounding areas. All contractors are licensed and insured.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
            {services.map((svc) => (
              <Card key={svc.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{svc.name}</CardTitle>
                    <Badge variant="secondary">{svc.range}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{svc.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.typical.map((t) => (
                      <span key={t} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6">Ready to get started?</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Submit a project request</Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">Contractor membership</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
