import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Small Business Owner",
    content:
      "Needed specialized equipment for my studio renovation. Nexus found three options I'd never seen, negotiated better pricing, and had everything delivered in 5 days. Worth every penny.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "Homeowner",
    content:
      "Moving coordination was seamless. They got competitive quotes from movers, scheduled everything, and followed up to make sure nothing was damaged. Made a stressful process actually manageable.",
    rating: 5,
  },
  {
    name: "Jennifer K.",
    role: "Professional",
    content:
      "I use their hourly support monthly for various tasks—from finding specific products to coordinating repairs. Response time is excellent and they always follow through exactly as promised.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-28 md:py-36 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-accent mb-6 uppercase border border-accent/20">
            Client Feedback
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">
            What <span className="text-accent">clients say</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Real feedback from clients who've used our services for sourcing, coordination, and project support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card relative"
            >
              <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">"{testimonial.content}"</p>

              <div className="pt-4 border-t border-border/50">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
