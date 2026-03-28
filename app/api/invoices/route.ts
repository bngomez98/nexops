import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceSentClientEmail } from '@/lib/email'
import { invoiceCreateSchema } from '@/lib/validators'
import { calculateInvoiceTotals } from '@/lib/business-logic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = invoiceCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { job_id, line_items } = parsed.data

    // Fetch the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*, properties(address, city, state)')
      .eq('id', job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Only the assigned contractor can create an invoice
    if (job.contractor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate amounts server-side
    const urgency = job.urgency ?? 'routine'
    const { subtotal, feeRate, nexusFee, total } = calculateInvoiceTotals(
      line_items as { amount: number }[],
      urgency
    )

    // Insert invoice record
    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        job_id,
        contractor_id: user.id,
        client_id: job.client_id,
        line_items,
        subtotal,
        nexus_fee: nexusFee,
        total,
        fee_rate: feeRate,
        urgency,
        status: 'draft',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Invoice insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }

    // Send invoice email to client when status is 'sent' (fire-and-forget)
    if (invoice.status === 'sent') {
      ;(async () => {
        try {
          const { getAdminClient } = await import('@/lib/supabase/admin')
          const admin = getAdminClient()
          const { data: clientAuth } = await admin.auth.admin.getUserById(job.client_id)
          const clientEmail = clientAuth.user?.email
          if (!clientEmail) return

          const { data: clientProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', job.client_id)
            .maybeSingle()

          const { data: contractorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .maybeSingle()

          await sendInvoiceSentClientEmail({
            to:             clientEmail,
            clientName:     clientProfile?.full_name ?? 'Client',
            contractorName: contractorProfile?.full_name ?? 'Your contractor',
            serviceType:    job.service_type,
            subtotal,
            nexusFee,
            total,
            jobId:          job_id,
          })
        } catch (err) {
          console.error('[invoices] email error:', err)
        }
      })()
    }

    return NextResponse.json({ invoice })
  } catch (err) {
    console.error('Invoice error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = user.user_metadata?.role as string | undefined

    let query = supabase.from('invoices').select('*, jobs(service_type, urgency, properties(address, city))')

    if (role === 'contractor') {
      query = query.eq('contractor_id', user.id)
    } else if (role === 'admin') {
      // Admin sees all
    } else {
      query = query.eq('client_id', user.id)
    }

    const { data: invoices, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }

    return NextResponse.json({ invoices: invoices ?? [] })
  } catch (err) {
    console.error('Invoice GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }

    const allowedStatuses = ['sent', 'draft']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 })
    }

    // Verify this is the contractor's invoice
    const { data: invoice } = await supabase
      .from('invoices')
      .select('id, contractor_id, client_id, status, job_id, total, nexus_fee, subtotal')
      .eq('id', id)
      .single()

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    if (invoice.contractor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Cannot modify a paid invoice' }, { status: 400 })
    }

    await supabase.from('invoices').update({ status }).eq('id', id)

    // When sending, notify the client
    if (status === 'sent') {
      ;(async () => {
        try {
          const { getAdminClient } = await import('@/lib/supabase/admin')
          const admin = getAdminClient()
          const { data: clientAuth } = await admin.auth.admin.getUserById(invoice.client_id)
          const clientEmail = clientAuth.user?.email
          if (!clientEmail) return

          const { data: clientProfile } = await supabase
            .from('profiles').select('full_name').eq('user_id', invoice.client_id).maybeSingle()
          const { data: contractorProfile } = await supabase
            .from('profiles').select('full_name').eq('user_id', user.id).maybeSingle()
          const { data: job } = await supabase
            .from('jobs').select('service_type').eq('id', invoice.job_id).single()

          const { sendInvoiceSentClientEmail } = await import('@/lib/email')
          await sendInvoiceSentClientEmail({
            to:             clientEmail,
            clientName:     clientProfile?.full_name ?? 'Client',
            contractorName: contractorProfile?.full_name ?? 'Your contractor',
            serviceType:    job?.service_type ?? 'service',
            subtotal:       invoice.subtotal,
            nexusFee:       invoice.nexus_fee,
            total:          invoice.total,
            jobId:          invoice.job_id,
          })
        } catch (err) {
          console.error('[invoices PATCH] email error:', err)
        }
      })()
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/invoices]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
