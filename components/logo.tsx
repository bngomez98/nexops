import Image from 'next/image'

/** Inline SVG icon that matches the Nexus Operations orbital mark */
function NexusIcon({ size = 30, className = '' }: { size?: number; className?: string }) {
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
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#2d6a42" strokeWidth="5.5" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#2d6a42" strokeWidth="5.5" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="#2d6a42" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="#2d6a42" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <line x1="60" y1="47" x2="60" y2="73" stroke="#2d6a42" strokeWidth="5" strokeLinecap="round" />
      <line x1="47" y1="60" x2="73" y2="60" stroke="#2d6a42" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({
  className = '',
  compact = false,
  variant = 'default',
  /** When true, text is rendered in white instead of foreground color (use on dark backgrounds) */
  onDark = false,
}: {
  className?: string
  compact?: boolean
  variant?: 'default' | 'icon' | 'image'
  onDark?: boolean
  /** Legacy prop – ignored. Kept to avoid breaking older call sites. */
  adaptive?: boolean
}) {
  if (variant === 'image') {
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

  if (variant === 'icon') {
    return <NexusIcon size={32} className={className} />
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <NexusIcon size={compact ? 24 : 30} />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span
            className={`text-[15px] font-extrabold tracking-tight ${
              onDark ? 'text-white' : 'text-foreground'
            }`}
          >
            NEXUS
          </span>
          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
            OPERATIONS
          </span>
        </div>
      )}
    </div>
  )
}
