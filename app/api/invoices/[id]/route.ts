/**
 * GET /api/invoices/[id] — fetch a single invoice.
 *
 * Access: contractor who issued it, client who received it, or admin.
 * Returned payload includes the related job + contractor/client display
 * data for the invoice detail page.
 */

import { createClient } from '@/lib/supabase/server'


type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        jobs(id, service_type, urgency, description, properties(address, city, state, zip_code)),
        contractor:profiles!invoices_contractor_id_fkey(id, full_name, email, phone, company, avatar_url),
        client:profiles!invoices_client_id_fkey(id, full_name, email, phone)
      `)
      .eq('id', id)
      .single()

    if (error || !invoice) {
      return Response.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const role = user.user_metadata?.role as string | undefined
    const canRead =
      role === 'admin' ||
      invoice.contractor_id === user.id ||
      invoice.client_id === user.id
    if (!canRead) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({ invoice })
  } catch (err) {
    console.error('[GET /api/invoices/[id]]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
