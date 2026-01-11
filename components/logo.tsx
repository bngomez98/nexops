export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* </CHANGE> */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Modern geometric nexus symbol with interconnected nodes */}
        <path d="M8 32V8L20 20L32 8V32L20 20L8 32Z" fill="currentColor" className="text-primary/20" />
        <circle cx="8" cy="8" r="3" fill="currentColor" className="text-primary" />
        <circle cx="32" cy="8" r="3" fill="currentColor" className="text-primary" />
        <circle cx="8" cy="32" r="3" fill="currentColor" className="text-primary" />
        <circle cx="32" cy="32" r="3" fill="currentColor" className="text-primary" />
        <circle cx="20" cy="20" r="4" fill="currentColor" className="text-accent" />
      </svg>
      {/* </CHANGE> */}
      <div className="flex flex-col leading-none">
        {/* </CHANGE> */}
        <span className="font-serif text-2xl font-light tracking-tight">Nexus</span>
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium">OPERATIONS</span>
        {/* </CHANGE> */}
      </div>
    </div>
  )
}
