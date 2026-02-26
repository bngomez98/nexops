export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M14 10C22 10 36 16 50 30C36 44 22 50 14 50C22 36 28 30 38 22"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          className="text-primary"
        />
        <path
          d="M50 10C42 10 28 16 14 30C28 44 42 50 50 50C42 36 36 30 26 22"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          className="text-primary"
        />
        <path d="M26 26L32 20L38 26L32 32L26 26Z" fill="currentColor" className="text-primary" />
        <path d="M20 32L26 26L32 32L26 38L20 32Z" fill="currentColor" className="text-primary" />
        <path d="M32 32L38 26L44 32L38 38L32 32Z" fill="currentColor" className="text-primary" />
        <path d="M26 38L32 32L38 38L32 44L26 38Z" fill="currentColor" className="text-primary" />
      </svg>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[20px] font-semibold tracking-[0.08em] text-primary">NEXUS</span>
          <span className="text-[10px] font-semibold tracking-[0.38em] uppercase text-foreground/90">OPERATIONS</span>
        </div>
      )}
    </div>
  )
}
