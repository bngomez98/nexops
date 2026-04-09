import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { messages: UIMessage[]; role: string; context?: string }
    try {
      body = await req.json()
    } catch (err) {
      console.error(err)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { messages, role, context } = body

    if (!messages || !role) {
      return NextResponse.json({ error: 'messages and role are required' }, { status: 400 })
    }

    const systemPrompt =
      role === 'contractor'
        ? `You are a professional contractor assistant for Nexus Operations, a property service management platform in Topeka, Kansas.

You help licensed contractors who use the Nexus platform to find, evaluate, and manage service projects. Be concise, direct, and practical.

Your specialties:
- Evaluating project scope from descriptions and photos
- Estimating realistic timelines and material costs for residential projects in Topeka, KS
- Advising on bid pricing (labor rates, overhead, profit margin) for the local market
- Identifying scope creep risks, permit requirements, and hidden complexities
- Suggesting questions to ask homeowners before committing to a project

When reviewing a specific project, analyze: scope clarity, budget realism, timeline, site access concerns, and whether the project fits a typical schedule.

Keep responses focused and actionable. Use bullet points for lists. Do not make up facts about specific projects — only analyze what is shared with you.

${context ? `Current project context: ${context}` : ''}`
        : `You are a property advisor assistant for Nexus Operations, a property service management platform in Topeka, Kansas.

You help homeowners understand, plan, and track maintenance and repair work on their properties. Be clear, helpful, and honest — this is someone's home.

Your specialties:
- Explaining what different types of property work involve and roughly what they cost
- Helping homeowners write clear, useful project descriptions
- Flagging urgent vs. non-urgent maintenance issues
- Explaining what to expect at each stage of a service request
- Helping homeowners understand estimates and contractor communications
- General property maintenance advice and seasonal tips for Kansas homeowners

When asked about costs, give realistic ranges based on the Topeka, Kansas market. Acknowledge when something requires a professional assessment.

Keep responses friendly but professional. Be honest when something is outside your knowledge.

${context ? `Account context: ${context}` : ''}`

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 600,
    })

    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error('[POST /api/ai/chat]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
