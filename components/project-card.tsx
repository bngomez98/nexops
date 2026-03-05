export function ProjectCard() {
  return (
    <div className="relative w-[340px] sm:w-[380px]">
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-2xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 0%, #22c55e33 0%, transparent 70%)' }}
      />

      <div className="relative bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[11px] text-[var(--color-subtle)] mb-1.5 uppercase tracking-wide">Exclusive lead claimed</p>
            <p className="font-bold text-[var(--color-foreground)] text-[16px] leading-snug">
              Roofing — Full Shingle<br />Replacement
            </p>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] whitespace-nowrap ml-4 flex-shrink-0">
            Confirmed
          </span>
        </div>

        {/* Detail rows */}
        <div className="divide-y divide-[#2a2a2a] mb-5">
          {[
            { label: 'Budget cap',     value: '$8,500 maximum' },
            { label: 'Location',       value: 'NE Topeka, KS' },
            { label: 'Documentation',  value: '9 photos · written scope' },
            { label: 'Consultation',   value: 'Sat, 10–11am — confirmed' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-[var(--color-subtle)]">{label}</span>
              <span className="text-[var(--color-foreground)] font-medium text-right ml-4">{value}</span>
            </div>
          ))}
        </div>

        {/* Lock notice */}
        <div className="bg-[var(--color-primary)]/[0.08] border border-[var(--color-primary)]/20 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-5">
          <svg className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-[12px] text-[var(--color-primary)] leading-relaxed">
            This lead is locked to one contractor. No one else can claim it.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-[var(--color-subtle)]">
          <span>Posted 6 minutes ago</span>
          <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" aria-hidden="true" />
            Claimed exclusively
          </span>
        </div>

      </div>
    </div>
  )
}
