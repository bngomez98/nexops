export function ProjectCard() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-subtle)] mb-1">Exclusive lead claimed</p>
          <p className="font-bold text-[var(--color-foreground)] text-base leading-snug">
            Roofing — Full Shingle<br />Replacement
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] whitespace-nowrap ml-4">
          Confirmed
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-5">
        {[
          { label: 'Budget cap', value: '$8,500 maximum' },
          { label: 'Location', value: 'NE Topeka, KS' },
          { label: 'Documentation', value: '9 photos · written scope' },
          { label: 'Consultation', value: 'Sat, 10–11am — confirmed' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-subtle)]">{label}</span>
            <span className="text-[var(--color-foreground)] font-medium text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Lock notice */}
      <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl px-4 py-3 flex items-start gap-2 mb-5">
        <svg className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-[var(--color-primary)] leading-relaxed">
          This lead is locked to one contractor. No one else can claim it.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--color-subtle)]">
        <span>Posted 6 minutes ago</span>
        <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
          <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
          Claimed exclusively
        </span>
      </div>
    </div>
  )
}
