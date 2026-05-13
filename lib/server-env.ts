/**
 * lib/server-env.ts
 *
 * Runtime validation for critical server-side environment variables.
 *
 * Call `assertServerEnv()` at the top of any API route or Server Action
 * that requires these secrets. On missing config it throws a descriptive
 * error that surfaces in server logs without leaking values to the client.
 *
 * ──────────────────────────────────────────────────────────────────────
 * Env variable catalog
 * ──────────────────────────────────────────────────────────────────────
 *
 * REQUIRED — server only (never expose to the browser)
 *   SUPABASE_SERVICE_ROLE_KEY   Supabase admin client (RLS bypass)
 *   STRIPE_SECRET_KEY           Stripe API calls from server routes
 *   STRIPE_WEBHOOK_SECRET       Stripe webhook signature verification
 *
 * REQUIRED — public (safe to expose, needed both server and client)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *
 * CONDITIONALLY REQUIRED
 *   RESEND_API_KEY              Required when sending transactional emails
 *   OPENAI_API_KEY              Required for /api/ai/* and /api/automation/categorize-request
 *   CRON_SECRET                 Required for /api/cron/* routes
 *
 * OPTIONAL — server
 *   SUPABASE_PROJECT_REF        Used by migration scripts
 *   SUPABASE_ACCESS_TOKEN       Used by migration scripts
 *   DATABASE_URL                Neon/Postgres pooled (legacy fallback)
 *   DATABASE_URL_UNPOOLED       Neon/Postgres direct (legacy fallback)
 *
 * OPTIONAL — public
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   NEXT_PUBLIC_AUTOMATION_ENABLED   (default: false)
 *   NEXT_PUBLIC_SITE_URL
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID
 *   NEXT_PUBLIC_GOOGLE_MERCHANT_ID
 *   NEXT_PUBLIC_ZENDESK_KEY
 *   NEXT_PUBLIC_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS
 *   NEXT_PUBLIC_DISPATCH_REGION_LAT / _LNG / _RADIUS_MILES
 *
 * NOTE: DATABASE_URL / DATABASE_URL_UNPOOLED are legacy Neon integration
 * variables. Supabase Postgres is the primary runtime database. The Neon
 * connection strings are only used by the /api/health connectivity check
 * and direct migration scripts. Target: deprecate and remove in Q3 2026
 * once all scripts are confirmed to run exclusively against Supabase.
 */

interface ServerEnvConfig {
  /** When true, also validates Stripe secrets. Default: true */
  requireStripe?: boolean
  /** When true, validates RESEND_API_KEY. Default: false */
  requireResend?: boolean
  /** When true, validates OPENAI_API_KEY. Default: false */
  requireOpenAI?: boolean
  /** When true, validates CRON_SECRET. Default: false */
  requireCron?: boolean
}

/**
 * Validate critical server environment variables.
 * Throws a descriptive Error listing every missing variable.
 *
 * @example
 * // At the top of a webhook handler:
 * assertServerEnv({ requireStripe: true })
 *
 * @example
 * // At the top of a cron route:
 * assertServerEnv({ requireCron: true })
 */
export function assertServerEnv(config: ServerEnvConfig = {}): void {
  const { requireStripe = true, requireResend = false, requireOpenAI = false, requireCron = false } = config
  const missing: string[] = []

  // ── Always required ───────────────────────────────────────────────────────
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY')
  }

  // ── Conditionally required ────────────────────────────────────────────────
  if (requireStripe) {
    if (!process.env.STRIPE_SECRET_KEY?.trim()) missing.push('STRIPE_SECRET_KEY')
    if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) missing.push('STRIPE_WEBHOOK_SECRET')
  }

  if (requireResend && !process.env.RESEND_API_KEY?.trim()) {
    missing.push('RESEND_API_KEY')
  }

  if (requireOpenAI && !process.env.OPENAI_API_KEY?.trim()) {
    missing.push('OPENAI_API_KEY')
  }

  if (requireCron && !process.env.CRON_SECRET?.trim()) {
    missing.push('CRON_SECRET')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
        'Check env.example and your deployment environment settings.',
    )
  }
}

/**
 * Returns true if all Stripe-related env vars are configured.
 * Use this for conditional logic rather than throwing.
 */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() && process.env.STRIPE_WEBHOOK_SECRET?.trim(),
  )
}

/**
 * Returns true if OpenAI is configured.
 * Guards AI routes that should degrade gracefully.
 */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}
