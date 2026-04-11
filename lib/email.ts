/**
 * Nexus Operations — Resend email utilities
 *
 * All outgoing transactional email flows in one place.
 * Set RESEND_API_KEY + RESEND_FROM_EMAIL in your environment.
 */

import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'Nexus Operations <noreply@nexusoperations.org>'
const SITE   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexusoperations.org'

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(s: string) {
  return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function wrap(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Nexus Operations</title>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f8f8f8;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
<tr><td style="background:#111827;padding:24px 32px;">
<span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Nexus Operations</span>
</td></tr>
<tr><td style="padding:32px 32px 24px;">
${body}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #f0f0f0;background:#fafafa;">
<p style="margin:0;font-size:12px;color:#9ca3af;">
Nexus Operations · Topeka, KS · <a href="${SITE}" style="color:#6366f1;">nexusoperations.org</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function btn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin-top:20px;">${label}</a>`
}

function h1(text: string) {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">${text}</h1>`
}

function p(text: string) {
  return `<p style="margin:12px 0;font-size:14px;color:#374151;line-height:1.6;">${text}</p>`
}

function small(text: string) {
  return `<p style="margin:8px 0;font-size:12px;color:#9ca3af;line-height:1.5;">${text}</p>`
}

// ─── Safe send wrapper (never throws) ────────────────────────────────────────

async function send(payload: {
  to: string | string[]
  subject: string
  html: string
}) {
  if (!process.env.RESEND_API_KEY) {
    // Email not configured — log and skip silently
    console.log('[email] RESEND_API_KEY not set — skipping:', payload.subject)
    return
  }
  try {
    await getResend().emails.send({ from: FROM, ...payload })
  } catch (err) {
    console.error('[email] send error:', err)
  }
}

// ─── Email triggers ───────────────────────────────────────────────────────────

/** 1. Welcome email after successful sign-up */
export async function sendWelcomeEmail(opts: { to: string; name: string; role: string }) {
  const dashHref = `${SITE}/dashboard/${opts.role}`
  await send({
    to: opts.to,
    subject: 'Welcome to Nexus Operations',
    html: wrap(`
      ${h1(`Welcome, ${opts.name.split(' ')[0]}!`)}
      ${p(`Your <strong>${fmt(opts.role)}</strong> account has been created. You're now part of Nexus Operations — Topeka's verified property services platform.`)}
      ${btn('Go to Your Dashboard', dashHref)}
      ${small('If you didn\'t create this account, please contact us immediately.')}
    `),
  })
}

/** 2. Contractor approved — access confirmed */
export async function sendContractorApprovedEmail(opts: { to: string; name: string }) {
  await send({
    to: opts.to,
    subject: 'Your Nexus Operations contractor account is approved',
    html: wrap(`
      ${h1('You\'re approved!')}
      ${p(`Hi ${opts.name.split(' ')[0]}, your contractor profile has been verified by the Nexus Operations team. You can now receive job assignments.`)}
      ${p('Head to your dashboard to check your availability, review your profile, and start receiving notifications for matching projects.')}
      ${btn('Go to Contractor Dashboard', `${SITE}/dashboard/contractor`)}
    `),
  })
}

/** 3. Contractor document expiring in 30 days */
export async function sendDocumentExpiringEmail(opts: {
  to: string
  name: string
  docType: string
  expiresAt: string
}) {
  await send({
    to: opts.to,
    subject: `Action required: ${fmt(opts.docType)} expiring soon`,
    html: wrap(`
      ${h1('Document expiring soon')}
      ${p(`Hi ${opts.name.split(' ')[0]}, your <strong>${fmt(opts.docType)}</strong> is set to expire on <strong>${new Date(opts.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.`)}
      ${p('Please upload an updated document to keep your account active and continue receiving job assignments. Your account will be paused if the document expires.')}
      ${btn('Upload Updated Document', `${SITE}/dashboard/contractor/documents`)}
    `),
  })
}

/** 4. Contractor notified of new job match */
export async function sendJobMatchedContractorEmail(opts: {
  to: string
  name: string
  jobId: string
  serviceType: string
  urgency: string
  propertyCity: string
  propertyState: string
}) {
  const urgencyLabel = fmt(opts.urgency)
  await send({
    to: opts.to,
    subject: `New job assigned: ${fmt(opts.serviceType)} in ${opts.propertyCity}`,
    html: wrap(`
      ${h1('You\'ve been assigned a new job')}
      ${p(`Hi ${opts.name.split(' ')[0]}, a new <strong>${fmt(opts.serviceType)}</strong> job in <strong>${opts.propertyCity}, ${opts.propertyState}</strong> has been assigned to you.`)}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Service</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${fmt(opts.serviceType)}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Location</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.propertyCity}, ${opts.propertyState}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Urgency</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${urgencyLabel}</td>
        </tr>
      </table>
      ${p('Log in to accept the job, view full details, and contact the client.')}
      ${btn('View Job Details', `${SITE}/dashboard/contractor/jobs/${opts.jobId}`)}
      ${small(`Based on urgency tier, expect to contact the client ${opts.urgency === 'emergency' ? 'within 1 hour' : opts.urgency === 'urgent' ? 'within 4 hours' : 'within 24 hours'}.`)}
    `),
  })
}

/** 5. Client notified that a contractor was assigned */
export async function sendContractorAssignedClientEmail(opts: {
  to: string
  clientName: string
  contractorName: string
  serviceType: string
  urgency: string
  jobId: string
}) {
  const contactWindow = opts.urgency === 'emergency' ? '1 hour' : opts.urgency === 'urgent' ? '4 hours' : '24 hours'
  await send({
    to: opts.to,
    subject: `Contractor assigned for your ${fmt(opts.serviceType)} request`,
    html: wrap(`
      ${h1('A contractor has been assigned')}
      ${p(`Hi ${opts.clientName.split(' ')[0]}, <strong>${opts.contractorName}</strong> has been assigned to your <strong>${fmt(opts.serviceType)}</strong> request.`)}
      ${p(`Expect to be contacted within <strong>${contactWindow}</strong> to schedule the work.`)}
      ${btn('View Request Details', `${SITE}/dashboard/homeowner/requests/${opts.jobId}`)}
      ${small('You can view the contractor\'s profile and contact information in your request details page after they accept the job.')}
    `),
  })
}

/** 6. Client receives invoice */
export async function sendInvoiceSentClientEmail(opts: {
  to: string
  clientName: string
  contractorName: string
  serviceType: string
  subtotal: number
  nexusFee: number
  total: number
  jobId: string
}) {
  await send({
    to: opts.to,
    subject: `Invoice received for your ${fmt(opts.serviceType)} project — $${opts.total.toFixed(2)}`,
    html: wrap(`
      ${h1('Invoice received')}
      ${p(`Hi ${opts.clientName.split(' ')[0]}, <strong>${opts.contractorName}</strong> has submitted an invoice for your <strong>${fmt(opts.serviceType)}</strong> project.`)}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:13px;color:#374151;">Services rendered</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;text-align:right;">$${opts.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:#374151;">Nexus platform fee</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;text-align:right;">$${opts.nexusFee.toFixed(2)}</td>
        </tr>
        <tr style="background:#f9fafb;border-top:2px solid #e5e5e5;">
          <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#111827;">Total due</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#111827;text-align:right;">$${opts.total.toFixed(2)}</td>
        </tr>
      </table>
      ${btn('Review & Pay Invoice', `${SITE}/dashboard/homeowner/requests/${opts.jobId}`)}
    `),
  })
}

/** 7. Receipt to contractor when invoice is paid */
export async function sendInvoicePaidContractorEmail(opts: {
  to: string
  contractorName: string
  serviceType: string
  subtotal: number
  nexusFee: number
  jobId: string
}) {
  await send({
    to: opts.to,
    subject: `Payment received — ${fmt(opts.serviceType)} — $${opts.subtotal.toFixed(2)}`,
    html: wrap(`
      ${h1('Payment received')}
      ${p(`Hi ${opts.contractorName.split(' ')[0]}, your invoice for the <strong>${fmt(opts.serviceType)}</strong> project has been paid.`)}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:13px;color:#374151;">Your earnings</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#059669;text-align:right;">$${opts.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:#374151;">Nexus fee (deducted)</td>
          <td style="padding:10px 16px;font-size:13px;color:#6b7280;text-align:right;">−$${opts.nexusFee.toFixed(2)}</td>
        </tr>
      </table>
      ${p('Your payout will be transferred to your Stripe Express account per your payout schedule.')}
      ${btn('View Payout Details', `${SITE}/dashboard/contractor/payments`)}
    `),
  })
}

/** 8. Receipt to client when invoice is paid */
export async function sendInvoicePaidClientEmail(opts: {
  to: string
  clientName: string
  contractorName: string
  serviceType: string
  total: number
  jobId: string
}) {
  await send({
    to: opts.to,
    subject: `Payment confirmed — ${fmt(opts.serviceType)} — $${opts.total.toFixed(2)}`,
    html: wrap(`
      ${h1('Payment confirmed')}
      ${p(`Hi ${opts.clientName.split(' ')[0]}, your payment of <strong>$${opts.total.toFixed(2)}</strong> for the <strong>${fmt(opts.serviceType)}</strong> project has been received.`)}
      ${p('Your project record has been updated. All receipts and project history are stored permanently in your account.')}
      ${btn('View Project Record', `${SITE}/dashboard/homeowner/requests/${opts.jobId}`)}
      ${small('Thank you for using Nexus Operations.')}
    `),
  })
}

/** 9. Contact form submission — sent to the admin inbox */
export async function sendContactFormEmail(opts: {
  name: string
  email: string
  phone: string
  type: string
  message: string
}) {
  const adminEmail = process.env.RESEND_FROM_EMAIL ?? 'admin@nexusoperations.org'
  await send({
    to: adminEmail,
    subject: `New contact form: ${fmt(opts.type)} inquiry from ${opts.name}`,
    html: wrap(`
      ${h1('New contact form submission')}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Name</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${opts.name}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.email}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Phone</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.phone || '—'}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Type</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${fmt(opts.type)}</td>
        </tr>
      </table>
      ${p(opts.message)}
      ${small(`Reply directly to <a href="mailto:${opts.email}" style="color:#6366f1;">${opts.email}</a>`)}
    `),
  })
}

/** 10. Contractor application — sent to admin + auto-reply to applicant */
export async function sendContractorApplicationEmail(opts: {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  serviceCategories: string
  yearsInBusiness: string
  licenseNumber?: string
  insuranceCarrier?: string
  serviceArea: string
  coverageNotes?: string
}) {
  const adminEmail = process.env.RESEND_FROM_EMAIL ?? 'admin@nexusoperations.org'
  const fullName = `${opts.firstName} ${opts.lastName}`

  // Admin notification
  await send({
    to: adminEmail,
    subject: `New contractor application: ${fullName} — ${opts.companyName}`,
    html: wrap(`
      ${h1('New Contractor Application')}
      ${p('<strong>Action required:</strong> Review and respond within 12 hours.')}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;width:36%;">Name</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Company</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.companyName}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;"><a href="mailto:${opts.email}" style="color:#6366f1;">${opts.email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Phone</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.phone}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Trade(s)</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.serviceCategories}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Years in Business</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.yearsInBusiness}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">License #</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.licenseNumber || '—'}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Insurance Carrier</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.insuranceCarrier || '—'}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Service Area</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.serviceArea}</td>
        </tr>
        ${opts.coverageNotes ? `<tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Notes</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.coverageNotes}</td>
        </tr>` : ''}
      </table>
      ${small('Submitted via nexusoperations.org/contractors/apply')}
    `),
  })

  // Auto-reply to applicant
  await send({
    to: opts.email,
    subject: 'Application received — Nexus Operations contractor network',
    html: wrap(`
      ${h1(`Application received, ${opts.firstName}.`)}
      ${p('We\'ve received your application to join the Nexus Operations contractor network. Our team reviews every application within <strong>12 hours</strong> and will follow up at this email address.')}
      ${p('Here\'s a summary of what you submitted:')}
      <table style="width:100%;margin:16px 0;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;width:40%;">Company</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.companyName}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;">Trade(s)</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.serviceCategories}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6b7280;">Service area</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;">${opts.serviceArea}</td>
        </tr>
      </table>
      ${p('While you wait, you can review how the network works and what to expect once you\'re approved.')}
      ${btn('Learn More', `${SITE}/contractors`)}
      ${small('Questions? Reply to this email or call us at (785) 727-1106.')}
    `),
  })
}
