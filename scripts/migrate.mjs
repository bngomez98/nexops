#!/usr/bin/env node
/**
 * Nexus Operations — database migration runner
 *
 * Applies scripts/setup.sql to the Supabase project using the
 * Management API.  Requires two environment variables:
 *
 *   SUPABASE_PROJECT_REF   — found in Project Settings → General
 *   SUPABASE_ACCESS_TOKEN  — personal access token from
 *                            https://supabase.com/dashboard/account/tokens
 *
 * Usage:
 *   SUPABASE_PROJECT_REF=xxxx SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/migrate.mjs
 *
 * Or add them to .env.local and run:
 *   node -r dotenv/config scripts/migrate.mjs
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dir, 'setup.sql'), 'utf8')

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!PROJECT_REF || !ACCESS_TOKEN) {
  console.error(
    '\nError: missing environment variables.\n' +
    'Set SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN before running this script.\n' +
    '\nGet your project ref from: Supabase Dashboard → Project Settings → General\n' +
    'Get an access token from:  https://supabase.com/dashboard/account/tokens\n'
  )
  process.exit(1)
}

console.log(`\nRunning migrations on project: ${PROJECT_REF}\n`)

const response = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  }
)

const text = await response.text()

if (!response.ok) {
  let detail = text
  try { detail = JSON.stringify(JSON.parse(text), null, 2) } catch {}
  console.error(`Migration failed (HTTP ${response.status}):\n${detail}`)
  process.exit(1)
}

console.log('✓ Migrations applied successfully.')
try {
  const result = JSON.parse(text)
  if (result?.length) console.log(JSON.stringify(result, null, 2))
} catch {}
