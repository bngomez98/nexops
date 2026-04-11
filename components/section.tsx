import type { ReactNode } from 'react'

type Tone = 'default' | 'muted' | 'dark' | 'primary'

const toneClasses: Record<Tone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-card text-foreground',
  dark: 'bg-[#0a0a0a] text-white',
  primary: 'bg-primary text-primary-foreground',
}

/** Full-width page section with a centered, constrained container. */
export function Section({
  children,
  tone = 'default',
  className = '',
  id,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-24 ${toneClasses[tone]} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  )
}

/** Standardized section heading: eyebrow + title + optional subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  onDark = false,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  onDark?: boolean
}) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
            onDark ? 'text-emerald-400' : 'text-primary'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1] ${
          onDark ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15px] leading-relaxed sm:text-base ${
            onDark ? 'text-white/65' : 'text-muted-foreground'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
