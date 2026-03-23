import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/** Nexus fee rates by urgency tier */
const FEE_RATES: Record<string, number> = {
  routine:   0.25,
  urgent:    0.30,
  emergency: 0.35,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { job_id, line_items } = body

    if (!job_id || !Array.isArray(line_items) || line_items.length === 0) {
      return NextResponse.json({ error: 'job_id and line_items are required' }, { status: 400 })
    }

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
    const subtotal = (line_items as { amount: number }[]).reduce((sum, item) => sum + (item.amount ?? 0), 0)
    const urgency  = job.urgency ?? 'routine'
    const feeRate  = FEE_RATES[urgency] ?? FEE_RATES.routine
    const nexusFee = Math.round(subtotal * feeRate * 100) / 100
    const total    = subtotal + nexusFee

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
