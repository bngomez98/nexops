import { rmSync } from 'fs'
import { rmSync } from 'fs'

try {
  rmSync('/vercel/share/v0-project/.next', { recursive: true, force: true })
  console.log('[v0] Cleared .next build cache')
} catch (error) {
  console.log('[v0] Cache clear attempted')
}
