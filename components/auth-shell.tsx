import Image from "next/image"
import Link from "next/link"

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

const highlights = [
  {
    heading: "Single-contractor routing",
    copy: "Each request is routed to one verified contractor to prevent bidding chaos and duplicated outreach.",
  },
  {
    heading: "Permanent project records",
    copy: "Photos, notes, and milestones are archived for insurance documentation, resale readiness, and maintenance planning.",
  },
  {
    heading: "Structured communication",
    copy: "Owners and contractors stay aligned with clear timelines, requirements, and documentation in one place.",
  },
]

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex lg:w-[460px] xl:w-[520px] flex-col border-r border-border bg-card/80 p-10">
        <Link href="/" className="mb-8 inline-flex">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={160} height={52} style={{ height: "30px", width: "auto" }} priority />
        </Link>

        <div className="relative mb-8 overflow-hidden rounded-2xl border border-border">
          <Image
            src="/photo-homeowner.jpg"
            alt="Homeowner documenting a property project"
            width={900}
            height={1100}
            className="h-[250px] w-full object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/90">Nexus Operations</p>
            <p className="mt-1 text-sm text-white/95">Property service workflows built for reliability, transparency, and long-term value.</p>
          </div>
        </div>

        <div className="space-y-4">
          {highlights.map((item) => (
            <div key={item.heading} className="rounded-lg border border-border bg-background/70 p-4">
              <h3 className="text-sm font-semibold">{item.heading}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>

        <p className="mt-auto pt-8 text-xs text-muted-foreground">Topeka, KS · (785) 428-0244 · admin@nexusoperations.org</p>
      </aside>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 lg:hidden">
            <Link href="/" className="inline-flex">
              <Image src="/nexus-logo.png" alt="Nexus Operations" width={145} height={48} style={{ height: "32px", width: "auto" }} priority />
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="text-[24px] font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </header>

          {children}
        </div>
      </section>
    </div>
  )
}
