export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nexus Operations Logo"
    >
      {/* Geometric nexus symbol - interconnected nodes representing operations network */}
      <circle cx="60" cy="30" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="30" cy="70" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="90" cy="70" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="60" cy="90" r="8" fill="currentColor" opacity="0.9" />

      {/* Connecting lines */}
      <line x1="60" y1="38" x2="60" y2="82" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      <line x1="38" y1="66" x2="82" y2="66" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      <line x1="60" y1="38" x2="36" y2="64" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      <line x1="60" y1="38" x2="84" y2="64" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />

      {/* Center nexus point */}
      <circle cx="60" cy="60" r="12" fill="currentColor" />
      <circle cx="60" cy="60" r="6" fill="currentColor" opacity="0.3" />
    </svg>
  )
}
