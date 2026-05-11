/** Flat-style construction worker illustration matching the brand design reference. */
export function ConstructionWorkerIllustration({
  className = '',
  size = 320,
}: {
  className?: string
  size?: number
}) {
  const w = size
  const h = Math.round(size * 1.25)

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 320 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Background - steel/construction bars */}
      <rect width="320" height="400" fill="#3d4f5f" />

      {/* Vertical rebar / construction grid lines */}
      {[32, 56, 80, 104, 128, 152, 176, 200, 224, 248, 272, 296].map((x) => (
        <rect key={x} x={x} y="0" width="6" height="280" rx="3" fill="#4a5d6d" />
      ))}

      {/* Ground / dirt area */}
      <rect y="280" width="320" height="120" fill="#a89279" />
      <rect y="275" width="320" height="12" fill="#8d7a64" rx="0" />

      {/* Worker body - hi-vis vest */}
      <rect x="120" y="155" width="80" height="110" rx="6" fill="#4a5d6d" />

      {/* Hi-vis vest overlay */}
      <rect x="112" y="148" width="96" height="120" rx="8" fill="#e8740a" opacity="0.95" />
      <rect x="120" y="155" width="80" height="110" rx="6" fill="#4a5d6d" />

      {/* Vest shoulder straps */}
      <rect x="115" y="148" width="18" height="120" rx="4" fill="#e8740a" />
      <rect x="187" y="148" width="18" height="120" rx="4" fill="#e8740a" />

      {/* Reflective stripes */}
      <rect x="118" y="195" width="84" height="6" rx="2" fill="#c4d62b" opacity="0.9" />
      <rect x="118" y="210" width="84" height="6" rx="2" fill="#c4d62b" opacity="0.9" />
      <rect x="118" y="235" width="84" height="6" rx="2" fill="#c4d62b" opacity="0.9" />
      <rect x="118" y="250" width="84" height="6" rx="2" fill="#c4d62b" opacity="0.9" />

      {/* Neck */}
      <rect x="144" y="125" width="32" height="30" rx="8" fill="#bfa882" />

      {/* Hard hat - brim */}
      <ellipse cx="160" cy="115" rx="38" ry="10" fill="#e8740a" />

      {/* Hard hat - dome */}
      <ellipse cx="160" cy="100" rx="30" ry="22" fill="#e8740a" />

      {/* Hard hat - front band */}
      <rect x="134" y="106" width="52" height="8" rx="3" fill="#d06808" />

      {/* Hard hat highlight */}
      <ellipse cx="155" cy="90" rx="16" ry="8" fill="#f09030" opacity="0.5" />
    </svg>
  )
}

/** Smaller badge-sized construction icon for inline use */
export function HardHatBadge({ className = '' }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#e8740a" opacity="0.12" />
      <ellipse cx="24" cy="22" rx="12" ry="8" fill="#e8740a" />
      <rect x="14" y="27" width="20" height="3" rx="1.5" fill="#e8740a" />
      <rect x="10" y="29" width="28" height="5" rx="2" fill="#d06808" opacity="0.7" />
      <rect x="16" y="33" width="16" height="4" rx="1" fill="#c4d62b" opacity="0.8" />
    </svg>
  )
}
