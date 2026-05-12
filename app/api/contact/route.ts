
import { contactFormSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactFormSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, type, message } = parsed.data

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: 'Email delivery is not configured' }, { status: 503 })
    }

    const { sendContactFormEmail } = await import('@/lib/email')
    await sendContactFormEmail({
      name: `${firstName} ${lastName}`,
      email,
      phone: phone ?? '',
      type,
      message,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
