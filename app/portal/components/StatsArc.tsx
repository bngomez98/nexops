'use client'

import { motion } from 'framer-motion'

interface StatsArcProps {
  completionRate: number
  open: number
  completed: number
}

export function StatsArc({ completionRate, open, completed }: StatsArcProps) {
  const radius = 100
  const stroke = 14
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const arcLength = circumference * 0.78 // 280deg arc
  const offset = arcLength - (arcLength * completionRate) / 100

  return (
    <div className="stats-arc">
      <svg viewBox="0 0 220 220" className="w-full h-full">
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* track */}
        <circle
          cx="110"
          cy="110"
          r={normalizedRadius}
          fill="none"
          stroke="rgba(148, 163, 255, 0.12)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform="rotate(130 110 110)"
        />

        {/* progress */}
        <motion.circle
          cx="110"
          cy="110"
          r={normalizedRadius}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          transform="rotate(130 110 110)"
          filter="url(#arcGlow)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
          Completion rate
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-6xl font-bold text-glow tracking-tight my-1"
        >
          {completionRate}
          <span className="text-2xl text-indigo-200/60">%</span>
        </motion.div>
        <div className="flex items-center gap-4 mt-1 text-[11px] text-indigo-200/70">
          <div className="text-center">
            <div className="text-white font-semibold text-base">{open}</div>
            <div>Open</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <div className="text-white font-semibold text-base">{completed}</div>
            <div>Done</div>
          </div>
        </div>
      </div>
    </div>
  )
}
