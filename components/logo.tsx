export function Logo({
  className = "",
  compact = false,
}: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="6" className="fill-foreground" />
        <path
          d="M7 21V7h2.1l4.9 9.1V7h2.1v14h-2.1L9.1 12.9V21H7z"
          className="fill-background"
        />
      </svg>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Nexus
          </span>
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
            Operations
          </span>
        </div>
      )}
    </div>
  )
}
