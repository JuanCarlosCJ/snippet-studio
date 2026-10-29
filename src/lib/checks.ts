import { DESCRIPTION, FONTS, IMAGE, TITLE } from './limits'
import { measureText } from './measure'
import { normalize, truncateToWidth } from './truncate'
import type { ImageInfo, Measure, Snippet } from './types'
import { parseUrl } from './url'

export type Level = 'ok' | 'warn' | 'error'

export type CheckId =
  | 'url.empty'
  | 'url.invalid'
  | 'url.noProtocol'
  | 'url.http'
  | 'url.ok'
  | 'title.empty'
  | 'title.short'
  | 'title.long'
  | 'title.ok'
  | 'description.empty'
  | 'description.short'
  | 'description.long'
  | 'description.ok'
  | 'image.none'
  | 'image.error'
  | 'image.tiny'
  | 'image.small'
  | 'image.ratio'
  | 'image.heavy'
  | 'image.upload'
  | 'image.ok'

export interface Check {
  id: CheckId
  level: Level
  values?: Record<string, string | number>
}

export interface CheckOptions {
  /** The image comes from a local file, so it has no public URL yet. */
  uploaded?: boolean
  measure?: Measure
}

export function runChecks(snippet: Snippet, image: ImageInfo, opts: CheckOptions = {}): Check[] {
  const measure = opts.measure ?? measureText
  const checks: Check[] = []

  // URL
  const url = parseUrl(snippet.url)
  if (url.ok === false) checks.push({ id: url.empty ? 'url.empty' : 'url.invalid', level: 'error' })
  else if (url.assumedProtocol) checks.push({ id: 'url.noProtocol', level: 'warn' })
  else if (url.url.protocol === 'http:') checks.push({ id: 'url.http', level: 'warn' })
  else checks.push({ id: 'url.ok', level: 'ok' })

  // Title
  const title = normalize(snippet.title)
  const titleChars = Array.from(title).length
  if (!title) {
    checks.push({ id: 'title.empty', level: 'error' })
  } else {
    const cut = truncateToWidth(title, TITLE.maxPx, FONTS.googleTitle, measure)
    if (cut.truncated) checks.push({ id: 'title.long', level: 'warn', values: { kept: cut.kept, n: titleChars } })
    else if (titleChars < TITLE.minChars) checks.push({ id: 'title.short', level: 'warn', values: { n: titleChars } })
    else checks.push({ id: 'title.ok', level: 'ok', values: { n: titleChars } })
  }

  // Description
  const desc = normalize(snippet.description)
  const descChars = Array.from(desc).length
  if (!desc) {
    checks.push({ id: 'description.empty', level: 'warn' })
  } else {
    const cut = truncateToWidth(desc, DESCRIPTION.maxPx, FONTS.googleDescription, measure)
    if (cut.truncated) checks.push({ id: 'description.long', level: 'warn', values: { kept: cut.kept, n: descChars } })
    else if (descChars < DESCRIPTION.minChars) checks.push({ id: 'description.short', level: 'warn', values: { n: descChars } })
    else checks.push({ id: 'description.ok', level: 'ok', values: { n: descChars } })
  }

  // Image
  checks.push(...imageChecks(image, opts.uploaded ?? false))
  return checks
}

function imageChecks(image: ImageInfo, uploaded: boolean): Check[] {
  if (image.status === 'none') return [{ id: 'image.none', level: 'warn' }]
  if (image.status === 'error') return [{ id: 'image.error', level: 'error' }]
  if (image.status === 'loading' || !image.width || !image.height) return []

  const { width: w, height: h } = image
  const out: Check[] = []
  const size = { w, h }

  if (w < IMAGE.minSide || h < IMAGE.minSide) out.push({ id: 'image.tiny', level: 'error', values: size })
  else if (w < IMAGE.largeMinWidth || h < IMAGE.largeMinHeight) out.push({ id: 'image.small', level: 'warn', values: size })

  const ratio = w / h
  if (Math.abs(ratio - IMAGE.ratio) / IMAGE.ratio > IMAGE.ratioTolerance) {
    out.push({ id: 'image.ratio', level: 'warn', values: { ratio: ratio.toFixed(2) } })
  }
  if (image.bytes !== undefined && image.bytes > IMAGE.maxBytes) {
    out.push({ id: 'image.heavy', level: 'warn', values: { mb: (image.bytes / 1024 / 1024).toFixed(1) } })
  }
  if (uploaded) out.push({ id: 'image.upload', level: 'warn' })
  if (!out.some(c => c.level !== 'ok' && c.id !== 'image.upload')) out.unshift({ id: 'image.ok', level: 'ok', values: size })
  return out
}

/** Large card (1.91:1 image on top) or small thumbnail beside the text. */
export function isLargeImage(image: ImageInfo): boolean {
  return (
    image.status === 'ok' &&
    (image.width ?? 0) >= IMAGE.largeMinWidth &&
    (image.height ?? 0) >= IMAGE.largeMinHeight
  )
}
