export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="180" height="180" rx="36" fill="currentColor" className="text-primary" />
        <path
          d="M40 140V40L90 90L140 40V140L90 90L40 140Z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
        <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
        <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
        <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
        <circle cx="90" cy="90" r="10" fill="white" />
      </svg>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-tight text-foreground">Nexus</span>
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground">Operations</span>
        </div>
      )}
    </div>
  )
}
