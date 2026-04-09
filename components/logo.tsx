import Image from "next/image"

/** Inline SVG icon that matches the Nexus Operations orbital mark */
function NexusIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer orbital ring – left tilt */}
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#3d7a4f" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Outer orbital ring – right tilt */}
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#3d7a4f" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Inner orbital ring – left tilt */}
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="#3d7a4f" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      {/* Inner orbital ring – right tilt */}
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="#3d7a4f" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      {/* Center cross node */}
      <line x1="60" y1="47" x2="60" y2="73" stroke="#3d7a4f" strokeWidth="5" strokeLinecap="round"/>
      <line x1="47" y1="60" x2="73" y2="60" stroke="#3d7a4f" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

export function Logo({
  className = "",
  compact = false,
  variant = "default",
  /** When true, renders text in foreground color (adapts to light/dark themes) */
  adaptive = false,
}: {
  className?: string
  compact?: boolean
  /** "default" = icon + wordmark | "icon" = icon only | "image" = uses nexus-logo.png */
  variant?: "default" | "icon" | "image"
  adaptive?: boolean
}) {
  if (variant === "image") {
    return (
      <Image
        src="/nexus-logo.png"
        alt="Nexus Operations"
        width={120}
        height={40}
        className={`h-7 w-auto ${className}`}
        priority
      />
    )
  }

  if (variant === "icon") {
    return <NexusIcon size={32} className={className} />
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <NexusIcon size={compact ? 24 : 30} />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span
            className={adaptive ? "text-[15px] font-bold tracking-tight text-foreground" : "text-[15px] font-bold tracking-tight"}
            style={adaptive ? undefined : { color: '#fff' }}
          >
            NEXUS
          </span>
          <span className="text-[9px] font-semibold tracking-[0.18em] uppercase" style={{ color: '#3d7a4f' }}>
            OPERATIONS
          </span>
        </div>
      )}
    </div>
  )
}
