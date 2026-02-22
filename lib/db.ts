/**
 * Prisma client singleton for Next.js.
 *
 * Prisma 7 requires a driver adapter.  PrismaBetterSqlite3 accepts a config
 * object with a `url` field (the SQLite file path as a file: URI), which it
 * uses internally to open a better-sqlite3 connection.
 *
 * The global pattern prevents creating multiple connections on each hot-reload
 * in development (Next.js re-evaluates modules on every request in watch mode).
 */
import path from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

declare global {
  // eslint-disable-next-line no-var
  var __nexops_db: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const dbPath = path.join(process.cwd(), "nexops.db")
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  return new PrismaClient({ adapter } as Parameters<typeof PrismaClient>[0])
}

export const db: PrismaClient = global.__nexops_db ?? createClient()

if (process.env.NODE_ENV !== "production") {
  global.__nexops_db = db
}
