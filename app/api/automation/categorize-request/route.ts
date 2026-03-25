import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
import { z } from 'zod'

const VALID_CATEGORIES = [
  'tree-removal', 'concrete-work', 'roofing', 'hvac',
  'fencing', 'electrical', 'plumbing', 'excavation',
] as const

export async function POST(request: NextRequest) {
  try {
    const { description, title } = await request.json()

    if (!description && !title) {
      return NextResponse.json({ error: 'title or description is required' }, { status: 400 })
    }

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({
        schema: z.object({
          suggestedCategory: z.enum(VALID_CATEGORIES).nullable(),
          confidence: z.number(),
          urgency: z.enum(['urgent', 'high', 'normal', 'low']),
          scopeSummary: z.string(),
          riskFlags: z.array(z.string()),
          estimatedBudgetRange: z.object({
            min: z.number(),
            max: z.number(),
          }),
          permitLikely: z.boolean(),
          followUpQuestion: z.string().nullable(),
        }),
      }),
      prompt: `You are a property maintenance intake specialist for Nexus Operations, a service management company in Topeka, Kansas.

A homeowner has submitted a new project request. Analyze it and return structured data.

Title: "${title ?? ''}"
Description: "${description ?? ''}"

Categorize this request into ONE of these trade categories (or null if unclear):
- tree-removal: Tree, stump, debris, limb work
- concrete-work: Driveways, sidewalks, patios, foundations
- roofing: Roof repair, replacement, gutters, leaks
- hvac: Heating, cooling, ventilation, furnace, AC, ductwork
- fencing: Wood, vinyl, chain-link, ornamental fence work
- electrical: Wiring, panels, outlets, fixtures, lighting
- plumbing: Pipes, drains, fixtures, water heater, leaks
- excavation: Grading, trenching, land clearing, drainage

Also provide:
- confidence: 0-100 how confident you are in the category
- urgency: 'urgent' (safety/emergency), 'high' (significant damage/inconvenience), 'normal' (standard repair), 'low' (cosmetic/planning)
- scopeSummary: 1-2 sentence plain-English summary of what the project likely involves, written for a contractor reviewing it
- riskFlags: Array of 0-3 potential issues or unknowns a contractor should verify (e.g. "permit may be required", "photos needed to assess scope", "age of system unknown") — empty array if none
- estimatedBudgetRange: Realistic min/max cost range in USD for the Topeka, KS residential market. Be specific based on the scope described.
- permitLikely: true if a permit is commonly required for this type of work in Kansas
- followUpQuestion: One clarifying question that would help a contractor prepare better, or null if the description is clear enough`,
    })

    return NextResponse.json(result.output)
  } catch (err) {
    console.error('[POST /api/automation/categorize-request]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
