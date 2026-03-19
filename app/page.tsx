import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  ArrowRight,
  TreePine,
  Hammer,
  Zap as ZapIcon,
  Wind,
  Fence,
  Wrench,
} from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  "Tree Removal": <TreePine className="h-6 w-6" />,
  "Concrete Work": <Hammer className="h-6 w-6" />,
  Roofing: <ZapIcon className="h-6 w-6" />,
  HVAC: <Wind className="h-6 w-6" />,
  Fencing: <Fence className="h-6 w-6" />,
  Electrical: <ZapIcon className="h-6 w-6" />,
  Plumbing: <Wrench className="h-6 w-6" />,
  Excavation: <Hammer className="h-6 w-6" />,
};

const services = [
  { name: "Tree Removal", range: "$500 – $8,000" },
  { name: "Concrete Work", range: "$1,200 – $15,000" },
  { name: "Roofing", range: "$300 – $25,000" },
  { name: "HVAC", range: "$3,000 – $20,000" },
  { name: "Fencing", range: "$1,500 – $8,000" },
  { name: "Electrical", range: "$500 – $10,000" },
  { name: "Plumbing", range: "TBD" },
  { name: "Excavation", range: "TBD" },
];

const howItWorksHomeowner = [
  {
    step: "1",
    title: "Submit your request",
    description: "Describe your project, upload photos, and set your maximum budget. It's free.",
  },
  {
    step: "2",
    title: "Get matched",
    description: "One verified, licensed, and insured contractor claims your project exclusively.",
  },
  {
    step: "3",
    title: "Confirmed within 24 hours",
    description: "Your contractor reaches out to schedule. No bidding wars, no multiple calls.",
  },
];

export default async function HomePage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary/80 px-4 py-24 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Serving Topeka, KS &amp; surrounding region
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            One request. One contractor.<br />No bidding wars.
          </h1>
          <p className="mt-6 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Submit a documented project request and a single verified, licensed contractor
            claims it exclusively. Confirmed within 24 hours. Always free for homeowners.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8">
                Submit a project request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contractors">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8">
                Join as a contractor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { icon: <Shield className="h-5 w-5 text-primary" />, text: "Licensed & insured contractors" },
              { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Free for homeowners" },
              { icon: <Clock className="h-5 w-5 text-primary" />, text: "Confirmed within 24 hours" },
              { icon: <Star className="h-5 w-5 text-primary" />, text: "Exclusive project claims" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-foreground">How it works for homeowners</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorksHomeowner.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/signup">
              <Button size="lg">
                Submit your project — it&apos;s free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-foreground">Service categories</h2>
          <p className="mt-4 text-center text-muted-foreground">Available in Topeka, KS and the surrounding region</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc) => (
              <Card key={svc.name} className="text-center hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mx-auto text-primary">{serviceIcons[svc.name]}</div>
                  <CardTitle className="text-base">{svc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{svc.range}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services">
              <Button variant="outline">View all services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for contractors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Built for serious contractors</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Flat monthly membership. Unlimited project claims. No per-lead fees. Full project
            documentation before you commit.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="outline">View membership tiers</Button>
            </Link>
            <Link href="/signup?role=contractor">
              <Button size="lg">Join as a contractor</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
