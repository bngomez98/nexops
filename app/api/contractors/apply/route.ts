
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

    if (process.env.RESEND_API_KEY) {
      const { sendContractorApplicationEmail } = await import('@/lib/email')
      await sendContractorApplicationEmail(data)
    } else {
      console.log('[contractors/apply] Submission (email not configured):', {
        name: `${data.firstName} ${data.lastName}`,
        company: data.companyName,
        email: data.email,
        trades: data.serviceCategories,
      })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[POST /api/contractors/apply]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
