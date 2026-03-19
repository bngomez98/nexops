import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Hammer, Lightbulb, Droplet, Zap, Fence, Home, Leaf, Wrench } from 'lucide-react'

const SERVICES = [
  {
    icon: Leaf,
    name: 'Tree Removal',
    description: 'Professional tree removal and yard cleanup services.',
    price: '$500 - $5,000+',
  },
  {
    icon: Hammer,
    name: 'Concrete Work',
    description: 'Durable concrete solutions for driveways, patios, and foundations.',
    price: '$1,000 - $10,000+',
  },
  {
    icon: Home,
    name: 'Roofing',
    description: 'Expert roof repair, installation, and maintenance.',
    price: '$2,000 - $15,000+',
  },
  {
    icon: Zap,
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services.',
    price: '$500 - $8,000+',
  },
  {
    icon: Fence,
    name: 'Fencing',
    description: 'Custom fence installation and repair for any style.',
    price: '$1,500 - $8,000+',
  },
  {
    icon: Lightbulb,
    name: 'Electrical',
    description: 'Licensed electrical work and installations.',
    price: '$300 - $5,000+',
  },
  {
    icon: Droplet,
    name: 'Plumbing',
    description: 'Professional plumbing repair and installation services.',
    price: '$300 - $3,000+',
  },
  {
    icon: Wrench,
    name: 'Excavation',
    description: 'Heavy equipment and excavation services for large projects.',
    price: '$2,000 - $20,000+',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Services Directory</h1>
          <p className="text-lg text-muted-foreground">
            Explore all home improvement services available on Nexus Operations
          </p>
        </div>
      </header>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <div
                key={i}
                className="border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="text-sm font-semibold text-accent mb-4">{service.price}</div>
                <Link href="/signup?role=homeowner">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Post a Request
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Don't see your service?</h2>
          <p className="text-muted-foreground mb-8">
            Contact us to discuss custom service requests or bulk projects.
          </p>
          <Button size="lg">Get in Touch</Button>
        </div>
      </section>
    </main>
  )
}
