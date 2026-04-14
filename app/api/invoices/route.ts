/**
 * /api/invoices
 *
 * Full lifecycle for contractor → client invoices:
 *
 *   POST   – contractor creates a draft invoice for their assigned job
 *   GET    – role-scoped list (contractor / client / admin)
 *   PATCH  – transition status (draft → sent → paid|overdue|void)
 *
 * Status transitions are validated server-side via
 * lib/business-logic.isValidInvoiceTransition. Only the contractor
 * can send/void; only admin (or the Stripe webhook via service role)
 * can mark paid. Overdue is set by the maintenance cron.
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceSentClientEmail } from '@/lib/email'
import { invoiceCreateSchema } from '@/lib/validators'
import {
  calculateInvoiceTotals,
  isValidInvoiceTransition,
  INVOICE_STATUS_TRANSITIONS,
} from '@/lib/business-logic'

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
    const dueDays = Number.isFinite(body.due_days) ? Math.max(1, Math.min(90, Number(body.due_days))) : 15

    // Fetch the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*, properties(address, city, state)')
      .eq('id', job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.contractor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate amounts server-side using urgency tier.
    const urgency = job.urgency ?? 'routine'
    const { subtotal, feeRate, nexusFee, total } = calculateInvoiceTotals(
      line_items as { amount: number }[],
      urgency
    )

    const dueDate = new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000).toISOString()

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
        due_date: dueDate,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Invoice insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
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

    const statusParam = request.nextUrl.searchParams.get('status')
    const role = user.user_metadata?.role as string | undefined

    let query = supabase
      .from('invoices')
      .select('*, jobs(service_type, urgency, properties(address, city))')

    if (role === 'contractor') {
      query = query.eq('contractor_id', user.id)
    } else if (role !== 'admin') {
      query = query.eq('client_id', user.id)
    }

    if (statusParam) {
      query = query.eq('status', statusParam)
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

    const { data: invoice } = await supabase
      .from('invoices')
      .select('id, contractor_id, client_id, status, job_id, total, nexus_fee, subtotal')
      .eq('id', id)
      .single()

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Role gate:
    //   • contractor → may move draft↔sent, or void unpaid invoices they own
    //   • admin / service role → may mark paid / void
    const role = user.user_metadata?.role as string | undefined
    const isOwner = invoice.contractor_id === user.id
    const isAdmin = role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Contractors can't retroactively mark paid — that's webhook/admin territory.
    if (status === 'paid' && !isAdmin) {
      return NextResponse.json(
        { error: 'Only admin or Stripe webhook can mark an invoice paid' },
        { status: 403 }
      )
    }

    // Validate the transition against the state machine.
    if (!isValidInvoiceTransition(invoice.status, status)) {
      return NextResponse.json({
        error: `Cannot transition from '${invoice.status}' to '${status}'`,
        allowed_transitions: INVOICE_STATUS_TRANSITIONS[invoice.status] ?? [],
      }, { status: 400 })
    }

    const { error: updErr } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)

    if (updErr) {
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }

    // Side effects per new status:
    if (status === 'sent') {
      ;(async () => {
        try {
          const { getAdminClient } = await import('@/lib/supabase/admin')
          const admin = getAdminClient()
          const { data: clientAuth } = await admin.auth.admin.getUserById(invoice.client_id)
          const clientEmail = clientAuth.user?.email
          if (!clientEmail) return

          const { data: clientProfile } = await supabase
            .from('profiles').select('full_name').eq('id', invoice.client_id).maybeSingle()
          const { data: contractorProfile } = await supabase
            .from('profiles').select('full_name').eq('id', invoice.contractor_id).maybeSingle()
          const { data: job } = await supabase
            .from('jobs').select('service_type').eq('id', invoice.job_id).single()

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

    if (status === 'paid') {
      // Mirror to the underlying service_request, if any.
      await supabase
        .from('service_requests')
        .update({ invoice_paid: true, invoice_amount: invoice.total })
        .eq('id', invoice.job_id)
        .then(() => {}, () => {})
    }

    return NextResponse.json({ success: true, status })
  } catch (err) {
    console.error('[PATCH /api/invoices]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
