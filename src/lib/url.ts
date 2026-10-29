export type ParsedUrl =
  | {
      ok: true
      url: URL
      /** Hostname without "www." (what most platforms display). */
      domain: string
      /** Path segments, decoded, as Google shows them: "blog › my-post". */
      crumbs: string[]
      /** True when the user left out http(s):// and we assumed https. */
      assumedProtocol: boolean
    }
  | { ok: false; empty: boolean }

export function parseUrl(raw: string): ParsedUrl {
  const input = raw.trim()
  if (!input) return { ok: false, empty: true }

  const hasProtocol = /^[a-z][a-z\d+\-.]*:\/\//i.test(input)
  let url: URL
  try {
    url = new URL(hasProtocol ? input : `https://${input}`)
  } catch {
    return { ok: false, empty: false }
  }

  const validHost = url.hostname === 'localhost' || /^[^.\s]+(\.[^.\s]+)+$/.test(url.hostname)
  if (!['http:', 'https:'].includes(url.protocol) || !validHost) return { ok: false, empty: false }

  const crumbs = url.pathname
    .split('/')
    .filter(Boolean)
    .map(part => {
      try {
        return decodeURIComponent(part)
      } catch {
        return part
      }
    })

  return {
    ok: true,
    url,
    domain: url.hostname.replace(/^www\./, ''),
    crumbs,
    assumedProtocol: !hasProtocol,
  }
}

/** Turns a possibly relative image URL into an absolute one, using the page URL as base. */
export function resolveImageUrl(imageUrl: string, pageUrl: string): string | null {
  const src = imageUrl.trim()
  if (!src) return null
  try {
    return new URL(src).href
  } catch {
    const page = parseUrl(pageUrl)
    if (!page.ok) return null
    try {
      return new URL(src, page.url).href
    } catch {
      return null
    }
  }
}

/** Google's breadcrumb line: "https://example.com › blog › post". Long paths are shortened. */
export function breadcrumb(parsed: ParsedUrl): string {
  if (!parsed.ok) return ''
  const origin = `${parsed.url.protocol}//${parsed.url.hostname}`
  const crumbs = parsed.crumbs.length > 3 ? [...parsed.crumbs.slice(0, 2), '...'] : parsed.crumbs
  return [origin, ...crumbs].join(' › ')
}
