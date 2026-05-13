declare module '*.css'

// Next.js injects __NEXT_DATA__ on the globalThis object at runtime.
// Declaring it here avoids the need for `(globalThis as any).__NEXT_DATA__`.
declare global {
  interface Window {
    __NEXT_DATA__?: Record<string, unknown>
  }
}
