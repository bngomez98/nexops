import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const REPO_ROOT = path.resolve(__dirname, '..')
const APP_DIR = path.join(REPO_ROOT, 'app')
const COMPONENTS_DIR = path.join(REPO_ROOT, 'components')

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

function walkFiles(dir: string, fileFilter: (filePath: string) => boolean): string[] {
  const output: string[] = []
  const stack = [dir]

  while (stack.length) {
    const current = stack.pop()
    if (!current) continue

    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      if (fileFilter(fullPath)) {
        output.push(fullPath)
      }
    }
  }

  return output
}

function getAllCodeFiles(): string[] {
  const inApp = walkFiles(APP_DIR, (filePath) => CODE_EXTENSIONS.has(path.extname(filePath)))
  const inComponents = walkFiles(COMPONENTS_DIR, (filePath) => CODE_EXTENSIONS.has(path.extname(filePath)))
  return [...inApp, ...inComponents]
}

function getPageRouteMap(): Map<string, string> {
  const pageFiles = walkFiles(APP_DIR, (filePath) => /[/\\]page\.(t|j)sx?$/.test(filePath))
  const routeToFile = new Map<string, string>()

  for (const file of pageFiles) {
    const pageDir = path.dirname(file)
    const relDir = path.relative(APP_DIR, pageDir)
    if (!relDir) {
      routeToFile.set('/', file)
      continue
    }

    const segments = relDir.split(path.sep).filter(Boolean).filter((segment) => !segment.startsWith('('))
    if (segments.some((segment) => segment.startsWith('[') && segment.endsWith(']'))) continue

    routeToFile.set(`/${segments.join('/')}`, file)
  }

  return routeToFile
}

function extractHrefCandidates(filePath: string): string[] {
  const source = fs.readFileSync(filePath, 'utf8')
  const patterns = [
    /href\s*=\s*"([^"]+)"/g,
    /href\s*=\s*'([^']+)'/g,
    /href\s*=\s*\{"([^"]+)"\}/g,
    /href\s*=\s*\{'([^']+)'\}/g,
    /href\s*:\s*"([^"]+)"/g,
    /href\s*:\s*'([^']+)'/g,
    /window\.location\.href\s*=\s*"([^"]+)"/g,
    /window\.location\.href\s*=\s*'([^']+)'/g,
  ]

  const links = new Set<string>()
  for (const pattern of patterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(source)) !== null) {
      links.add(match[1])
    }
  }

  return [...links]
}

function isInternalRoute(href: string): boolean {
  return (
    href.startsWith('/') &&
    !href.startsWith('//') &&
    !href.startsWith('/api/') &&
    !href.startsWith('/_next/')
  )
}

function normalizeRoute(href: string): { route: string; hash: string | null } {
  const [beforeHash, hashPart] = href.split('#')
  const routeOnly = beforeHash.split('?')[0]
  const route = routeOnly === '' ? '/' : routeOnly
  return { route, hash: hashPart ?? null }
}

describe('internal link integrity', () => {
  it('has no dead internal routes or hash fragment targets', () => {
    const codeFiles = getAllCodeFiles()
    const routeToFile = getPageRouteMap()
    const missingRoutes: string[] = []
    const missingHashes: string[] = []

    const allLinks = new Set<string>()
    for (const filePath of codeFiles) {
      for (const href of extractHrefCandidates(filePath)) {
        allLinks.add(href)
      }
    }

    const sortedLinks = [...allLinks].sort()
    for (const href of sortedLinks) {
      if (!isInternalRoute(href)) continue
      if (href.includes('${')) continue

      const { route, hash } = normalizeRoute(href)

      if (route.includes('[') && route.includes(']')) continue

      const targetFile = routeToFile.get(route)
      if (!targetFile) {
        missingRoutes.push(href)
        continue
      }

      if (!hash) continue

      const targetSource = fs.readFileSync(targetFile, 'utf8')
      const escapedHash = hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const idPatterns = [
        new RegExp(`id\\s*=\\s*"${escapedHash}"`),
        new RegExp(`id\\s*=\\s*'${escapedHash}'`),
        new RegExp(`id\\s*=\\s*\\{"${escapedHash}"\\}`),
        new RegExp(`id\\s*=\\s*\\{'${escapedHash}'\\}`),
      ]

      if (!idPatterns.some((pattern) => pattern.test(targetSource))) {
        missingHashes.push(href)
      }
    }

    expect(missingRoutes, `Missing internal routes:\n${missingRoutes.join('\n')}`).toEqual([])
    expect(missingHashes, `Missing hash targets:\n${missingHashes.join('\n')}`).toEqual([])
  })
})
