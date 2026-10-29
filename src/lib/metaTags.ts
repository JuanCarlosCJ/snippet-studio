import { normalize } from './truncate'
import type { ImageInfo, Snippet } from './types'
import { parseUrl, resolveImageUrl } from './url'

export interface TagOptions {
  image?: ImageInfo
  /** Used instead of the image URL when the image was uploaded from disk. */
  uploadPlaceholder?: string
  uploaded?: boolean
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Builds the <head> tags for search engines, Open Graph and X. Empty fields are left out. */
export function buildMetaTags(snippet: Snippet, opts: TagOptions = {}): string {
  const title = normalize(snippet.title)
  const description = normalize(snippet.description)
  const siteName = normalize(snippet.siteName)
  const parsed = parseUrl(snippet.url)
  const url = parsed.ok ? parsed.url.href : ''
  const image = opts.uploaded
    ? opts.uploadPlaceholder ?? ''
    : resolveImageUrl(snippet.imageUrl, snippet.url) ?? ''
  const handle = normalize(snippet.twitterSite).replace(/^@?/, '@')
  const hasHandle = handle.length > 1
  const size = opts.image?.status === 'ok' ? opts.image : undefined

  const lines: string[] = []
  const meta = (attr: 'name' | 'property', key: string, value: string) => {
    if (value) lines.push(`<meta ${attr}="${key}" content="${escape(value)}">`)
  }

  if (title) lines.push(`<title>${escape(title)}</title>`)
  meta('name', 'description', description)
  if (url) lines.push(`<link rel="canonical" href="${escape(url)}">`)

  lines.push('', '<!-- Open Graph: Facebook, LinkedIn, WhatsApp... -->')
  meta('property', 'og:type', 'website')
  meta('property', 'og:url', url)
  meta('property', 'og:title', title)
  meta('property', 'og:description', description)
  meta('property', 'og:image', image)
  if (image && size?.width && size.height) {
    meta('property', 'og:image:width', String(size.width))
    meta('property', 'og:image:height', String(size.height))
  }
  meta('property', 'og:site_name', siteName)

  lines.push('', '<!-- X (Twitter) -->')
  meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  if (hasHandle) meta('name', 'twitter:site', handle)
  meta('name', 'twitter:title', title)
  meta('name', 'twitter:description', description)
  meta('name', 'twitter:image', image)

  return lines.join('\n')
}
