import { measureText } from './measure'
import type { Measure } from './types'

export const ELLIPSIS = ' ...'

/** Collapses runs of whitespace and trims, like a browser does when rendering. */
export function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export interface Truncated {
  text: string
  truncated: boolean
  /** How many characters of the original survived. */
  kept: number
}

/**
 * Cuts text so that it (plus " ...") fits in maxWidth pixels, preferring to
 * break at a word boundary, which is what Google does with titles and snippets.
 */
export function truncateToWidth(
  raw: string,
  maxWidth: number,
  font: string,
  measure: Measure = measureText,
): Truncated {
  const text = normalize(raw)
  const chars = Array.from(text) // keeps emoji and other surrogate pairs whole
  if (measure(text, font) <= maxWidth) return { text, truncated: false, kept: chars.length }

  // Binary search for the longest prefix that fits with the ellipsis.
  let lo = 0
  let hi = chars.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    if (measure(chars.slice(0, mid).join('') + ELLIPSIS, font) <= maxWidth) lo = mid
    else hi = mid - 1
  }

  let cut = chars.slice(0, lo).join('')
  const lastSpace = cut.lastIndexOf(' ')
  // Back off to the last whole word, unless that would throw away too much.
  if (lastSpace > cut.length * 0.6) cut = cut.slice(0, lastSpace)
  cut = cut.replace(/[\s,;:.\-–—|]+$/, '')

  return { text: cut + ELLIPSIS, truncated: true, kept: Array.from(cut).length }
}
