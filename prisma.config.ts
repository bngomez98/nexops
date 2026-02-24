import path from "path"
import { defineConfig } from "prisma/config"

// Prisma 7: datasource URL is configured here, not in schema.prisma.
// The driver adapter (better-sqlite3) is passed to PrismaClient in lib/db.ts.
const DB_PATH = path.join(process.cwd(), "nexops.db")

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${DB_PATH}`,
  },
})
