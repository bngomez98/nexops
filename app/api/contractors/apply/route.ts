
import { contractorApplicationSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contractorApplicationSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: 'Email delivery is not configured' }, { status: 503 })
    }

    const { sendContractorApplicationEmail } = await import('@/lib/email')
    await sendContractorApplicationEmail(data)

    return Response.json({ success: true })
  } catch (err) {
    console.error('[POST /api/contractors/apply]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
