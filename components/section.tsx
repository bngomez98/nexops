import type { ReactNode } from 'react'

type Tone = 'default' | 'muted' | 'dark' | 'primary'

const toneClasses: Record<Tone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/50 text-foreground',
  dark: 'section-dark',
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
      className={`relative py-16 sm:py-20 lg:py-24 ${toneClasses[tone]} ${className}`}
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
          className={`font-mono-label mb-3 ${
            onDark ? 'text-emerald-400' : 'text-primary'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-[1.15] text-balance ${
          onDark ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            onDark ? 'text-white/70' : 'text-muted-foreground'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
