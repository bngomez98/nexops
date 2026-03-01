import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

const SYSTEM = `You are the Nexus Assistant, a helpful AI for Nexus Operations — a contractor marketplace based in Topeka, KS.

Nexus Operations connects homeowners and property managers with licensed, insured contractors for residential and commercial maintenance, restoration, remediation, and emergency response services.

Key facts:
- Service area: Topeka, KS and surrounding region (expanding to Lawrence, Manhattan, Salina, Wichita)
- Service categories: Tree Removal, Concrete Work, Roofing, HVAC, Fencing, Electrical, Plumbing, Excavation
- Contact: admin@nexusoperations.org | (913) 951-1711 | Mon–Fri 8 AM–5 PM CT

For homeowners:
- Submit project requests for free at nexusoperations.org/login
- Each request is matched exclusively to one verified, licensed, insured contractor — no bidding wars
- Requests include photos, written scope, and a defined budget cap
- Contractors reach out to schedule a consultation within 24 hours

For contractors (membership plans):
- Standard: $299/month — real-time project feed, unlimited claims
- Premium: $499/month — 90-second advance window before the standard pool
- Elite: $749/month — 10-minute exclusive window on projects over $5K
- All plans: unlimited claims, full project documentation, performance analytics
- Verification requires: business license, trade licenses, general liability insurance ($500K per occurrence / $1M aggregate), workers' comp if you have employees

Keep answers concise and friendly. If a question is outside Nexus Operations, politely redirect to how you can help with contractor or homeowner questions.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 })
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    })

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : ""

    return NextResponse.json({ content })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
