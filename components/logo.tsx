export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="6" className="fill-primary" />
        <path
          d="M8 24V8h2.4l5.6 10.4V8h2.4v16h-2.4L10.4 13.6V24H8z"
          className="fill-primary-foreground"
        />
      </svg>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Nexus</span>
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">Operations</span>
        </div>
      )}
    </div>
  )
}
