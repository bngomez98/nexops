import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, type, message } = parsed.data

    // Send via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const { sendContactFormEmail } = await import('@/lib/email')
      await sendContactFormEmail({
        name: `${firstName} ${lastName}`,
        email,
        phone: phone ?? '',
        type,
        message,
      })
    } else {
      // Log submission when email is not configured
      console.log('[contact] Form submission:', { firstName, lastName, email, type })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
