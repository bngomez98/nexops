import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns true if every sentence in the text starts with a capital letter
 * and ends with a period, exclamation mark, or question mark.
 * The overall text must also contain at least 3 words.
 */
export function isFullSentences(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false

  // Must have at least 3 words
  if (trimmed.split(/\s+/).length < 3) return false

  // Split into individual sentences on sentence-ending punctuation
  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return sentences.every(
    (sentence) =>
      /^[A-Z]/.test(sentence) && /[.!?]$/.test(sentence)
  )
}
