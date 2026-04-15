'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2, RefreshCw, AlertTriangle, Info, Zap, ChevronDown, ChevronUp } from 'lucide-react'

interface Recommendation {
  title: string
  body: string
  urgency: 'high' | 'medium' | 'low'
  category: string | null
}

interface HomeownerInsights {
  headline: string
  summary: string
  recommendations: Recommendation[]
  maintenanceTip: string
}

interface ProjectScore {
  index: number
  fitScore: number
  fitLabel: 'Excellent' | 'Good' | 'Fair' | 'Skip'
  reason: string
}

interface ContractorInsights {
  marketInsight: string
  pricingTip: string
  projectScores: ProjectScore[]
}

interface AIInsightsCardProps {
  role: 'homeowner' | 'contractor'
  requests: Record<string, unknown>[]
  profile?: Record<string, unknown>
}

const URGENCY_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  high:   { bg: 'bg-red-50 border-red-200',    text: 'text-red-700',    icon: AlertTriangle },
  medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700',  icon: Zap },
  low:    { bg: 'bg-sky-50 border-sky-200',     text: 'text-sky-700',    icon: Info },
}

const FIT_STYLE: Record<string, { bg: string; text: string; bar: string }> = {
  Excellent: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  Good:      { bg: 'bg-primary/10',  text: 'text-primary',     bar: 'bg-primary' },
  Fair:      { bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'bg-amber-500' },
  Skip:      { bg: 'bg-slate-100',   text: 'text-slate-600',   bar: 'bg-slate-400' },
}

export function AIInsightsCard({ role, requests, profile }: AIInsightsCardProps) {
  const [data, setData] = useState<HomeownerInsights | ContractorInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [fetched, setFetched] = useState(false)

  async function fetchInsights() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, requests, profile }),
      })
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      setData(json)
      setFetched(true)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-fetch once requests are available
    if (!fetched && requests.length >= 0) {
      fetchInsights()
    }
  }, [requests.length])

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">
              {role === 'homeowner' ? 'AI Property Insights' : 'AI Project Intelligence'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {role === 'homeowner' ? 'Personalized maintenance analysis' : 'Project scoring & market analysis'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fetched && !loading && (
            <button
              onClick={fetchInsights}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="Refresh insights"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5">
          {loading && (
            <div className="flex items-center gap-3 py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <p className="text-[13px] text-muted-foreground">Analyzing your data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-[13px] text-muted-foreground">Couldn&apos;t load insights right now.</p>
              <button onClick={fetchInsights} className="text-[12px] text-primary hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Try again
              </button>
            </div>
          )}

          {/* HOMEOWNER VIEW */}
          {!loading && !error && data && role === 'homeowner' && (
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <p className="text-[15px] font-bold text-foreground mb-1">
                  {(data as HomeownerInsights).headline}
                </p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {(data as HomeownerInsights).summary}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-2.5">
                {(data as HomeownerInsights).recommendations?.map((rec, i) => {
                  const style = URGENCY_STYLE[rec.urgency] ?? URGENCY_STYLE.low
                  const UrgencyIcon = style.icon
                  return (
                    <div key={i} className={`rounded-xl border p-3.5 ${style.bg}`}>
                      <div className="flex items-start gap-2.5">
                        <UrgencyIcon className={`w-4 h-4 ${style.text} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className={`text-[12.5px] font-semibold ${style.text}`}>{rec.title}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text} opacity-70`}>
                              {rec.urgency}
                            </span>
                          </div>
                          <p className="text-[12px] text-foreground/80 leading-relaxed">{rec.body}</p>
                          {rec.category && (
                            <p className="text-[10.5px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">
                              {rec.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Seasonal tip */}
              {(data as HomeownerInsights).maintenanceTip && (
                <div className="bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-foreground/90 leading-relaxed">
                    <span className="font-semibold text-primary">Seasonal tip: </span>
                    {(data as HomeownerInsights).maintenanceTip}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CONTRACTOR VIEW */}
          {!loading && !error && data && role === 'contractor' && (
            <div className="space-y-4">
              {/* Market & pricing insights */}
              <div className="grid sm:grid-cols-2 gap-3">
                {(data as ContractorInsights).marketInsight && (
                  <div className="bg-secondary rounded-xl p-3.5">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Market</p>
                    <p className="text-[12.5px] text-foreground leading-relaxed">
                      {(data as ContractorInsights).marketInsight}
                    </p>
                  </div>
                )}
                {(data as ContractorInsights).pricingTip && (
                  <div className="bg-primary/8 border border-primary/20 rounded-xl p-3.5">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-primary/70 mb-1.5">Pricing</p>
                    <p className="text-[12.5px] text-foreground leading-relaxed">
                      {(data as ContractorInsights).pricingTip}
                    </p>
                  </div>
                )}
              </div>

              {/* Project scores */}
              {(data as ContractorInsights).projectScores?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">
                    Project Fit Scores
                  </p>
                  <div className="space-y-2.5">
                    {(data as ContractorInsights).projectScores.map((score) => {
                      const style = FIT_STYLE[score.fitLabel] ?? FIT_STYLE.Fair
                      return (
                        <div key={score.index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[12px] font-bold text-muted-foreground flex-shrink-0">
                            {score.index}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                                {score.fitLabel}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{score.fitScore}/100</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden mb-1.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                                style={{ width: `${score.fitScore}%` }}
                              />
                            </div>
                            <p className="text-[12px] text-muted-foreground leading-snug">{score.reason}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/60 mt-4">
            AI-generated analysis — use as guidance, not a guarantee.
          </p>
        </div>
      )}
    </div>
  )
}
