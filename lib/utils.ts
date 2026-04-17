/**
 * Pure CSS class utility — no Tailwind runtime dependency.
 *
 * cn(...inputs) concatenates class names, filtering falsy values.
 * Works as a drop-in replacement for the previous clsx + tailwind-merge combo.
 * Since we now use statically-defined CSS utility classes (not Tailwind's
 * on-demand generation), standard string concatenation is sufficient — CSS
 * specificity and declaration order in the stylesheet resolve any conflicts.
 */

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

function toClass(value: ClassValue): string {
  if (!value && value !== 0) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(toClass).filter(Boolean).join(' ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(' ')
  }
  return ''
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toClass).filter(Boolean).join(' ')
}
