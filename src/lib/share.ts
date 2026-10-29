import type { Snippet } from './types'

// Short keys keep share links shorter.
const KEYS: Record<keyof Snippet, string> = {
  url: 'u',
  title: 't',
  description: 'd',
  siteName: 's',
  imageUrl: 'i',
  twitterSite: 'x',
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  bytes.forEach(b => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(data: string): string {
  const b64 = data.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)))
}

/** Encodes a snippet into a URL hash like "#s=eyJ1Ijo...". */
export function encodeSnippet(snippet: Snippet): string {
  const short: Record<string, string> = {}
  for (const key of Object.keys(KEYS) as (keyof Snippet)[]) {
    if (snippet[key]) short[KEYS[key]] = snippet[key]
  }
  return `#s=${toBase64Url(JSON.stringify(short))}`
}

/** Reads a snippet back from a URL hash. Returns null if there's none or it's broken. */
export function decodeSnippet(hash: string): Snippet | null {
  const match = /[#&]s=([A-Za-z0-9_-]+)/.exec(hash)
  if (!match) return null
  try {
    const short = JSON.parse(fromBase64Url(match[1]))
    if (!short || typeof short !== 'object') return null
    const out = {} as Snippet
    for (const key of Object.keys(KEYS) as (keyof Snippet)[]) {
      const value = short[KEYS[key]]
      out[key] = typeof value === 'string' ? value.slice(0, 2000) : ''
    }
    return out
  } catch {
    return null
  }
}
