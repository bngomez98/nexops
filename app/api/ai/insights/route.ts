import { generateText, Output } from 'ai'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface InsightRequest {
  status: string
  category: string
  title?: string
  description?: string
}

interface ProjectScore {
  category: string
  title?: string
  description?: string
  budget?: number
}

interface ContractorProfile {
  serviceCategories?: string[]
  averageRating?: number
  currentActiveProjects?: number
  maxActiveProjects?: number
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { role: string; requests?: InsightRequest[] | ProjectScore[]; profile?: ContractorProfile }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { role, requests, profile } = body

    if (!role) {
      return NextResponse.json({ error: 'role is required' }, { status: 400 })
    }

    if (role === 'homeowner') {
      // Summarize a homeowner's request history and surface maintenance advice
      const requestSummary = ((requests ?? []) as InsightRequest[])
        .slice(0, 10)
        .map(r => `- [${r.status}] ${r.category}: ${r.title ?? r.description?.slice(0, 80)}`)
        .join('\n') || 'No requests yet.'

      const result = await generateText({
        model: 'openai/gpt-4o-mini',
        output: Output.object({
          schema: z.object({
            headline: z.string(),
            summary: z.string(),
            recommendations: z.array(
              z.object({
                title: z.string(),
                body: z.string(),
                urgency: z.enum(['high', 'medium', 'low']),
                category: z.string().nullable(),
              })
            ),
            maintenanceTip: z.string(),
          }),
        }),
        prompt: `You are a property advisor. Based on this homeowner's service request history, generate intelligent maintenance insights.

Service history:
${requestSummary}

Generate:
1. A short headline (under 10 words) summarizing the property's maintenance status
2. A 1-2 sentence summary of what you observe
3. 2-3 specific, actionable maintenance recommendations relevant to their history and Kansas seasonal cycles (be specific — if they've done roofing work, check gutters; if HVAC, remind about filter schedule, etc.)
4. One quick maintenance tip for the current season (it is currently spring in Kansas)

For each recommendation: give a short title, a 1-sentence explanation, urgency (high/medium/low), and the relevant trade category if applicable.

Be concrete and useful, not generic. If no history exists, give general Kansas homeowner spring maintenance advice.`,
      })

      return Response.json(result.output)
    }

    if (role === 'contractor') {
      // Score available projects for fit against this contractor's profile
      const projectList = ((requests ?? []) as ProjectScore[])
        .slice(0, 5)
        .map((p, i) =>
          `Project ${i + 1}: [${p.category}] ${p.title ?? p.description?.slice(0, 100)} — Budget: $${p.budget ?? 'unspecified'}`
        )
        .join('\n') || 'No projects provided.'

      const contractorInfo = profile
        ? `Trade category: ${(profile as ContractorProfile).serviceCategories?.join(', ') || 'general'}, Rating: ${(profile as ContractorProfile).averageRating ?? 'N/A'}, Active projects: ${(profile as ContractorProfile).currentActiveProjects ?? 0}/${(profile as ContractorProfile).maxActiveProjects ?? 3}`
        : 'General contractor, no profile data.'

      const result = await generateText({
        model: 'openai/gpt-4o-mini',
        output: Output.object({
          schema: z.object({
            marketInsight: z.string(),
            pricingTip: z.string(),
            projectScores: z.array(
              z.object({
                index: z.number(),
                fitScore: z.number(),
                fitLabel: z.enum(['Excellent', 'Good', 'Fair', 'Skip']),
                reason: z.string(),
              })
            ),
          }),
        }),
        prompt: `You are a contractor advisor. Review these available projects for a Nexus Operations contractor and score each one.

Contractor profile: ${contractorInfo}

Available projects:
${projectList}

For each project (by index, 1-based):
- Give a fit score from 0-100 based on: scope clarity, budget realism for Topeka KS market, and general desirability
- Give a fit label: Excellent (80+), Good (60-79), Fair (40-59), Skip (<40)
- Give a one-sentence reason for the score

Also provide:
- A 1-sentence market insight about project availability or demand patterns you observe
- A 1-sentence pricing tip relevant to the projects shown

Be concise and direct. These are experienced tradespeople.`,
      })

      return Response.json(result.output)
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch (err) {
    console.error('[POST /api/ai/insights]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
