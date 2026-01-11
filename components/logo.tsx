export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Geometric N symbol representing Nexus - interconnected nodes */}
        <path d="M8 28V8L18 18L28 8V28L18 18L8 28Z" fill="currentColor" className="text-primary" />
        <circle cx="8" cy="8" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="28" cy="8" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="8" cy="28" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="28" cy="28" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="18" cy="18" r="2.5" fill="currentColor" className="text-accent" />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-serif text-xl font-semibold tracking-tight">Nexus</span>
        <span className="text-xs tracking-widest text-muted-foreground">OPERATIONS</span>
      </div>
    </div>
  )
}
