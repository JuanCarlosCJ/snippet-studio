import { describe, expect, it } from 'vitest'
import { runChecks } from './checks'
import { buildMetaTags } from './metaTags'
import { decodeSnippet, encodeSnippet } from './share'
import { normalize, truncateToWidth } from './truncate'
import type { ImageInfo, Measure, Snippet } from './types'
import { breadcrumb, parseUrl, resolveImageUrl } from './url'

// Every character is 10px wide, so widths are easy to reason about.
const mono: Measure = text => Array.from(text).length * 10

const snippet = (over: Partial<Snippet> = {}): Snippet => ({
  url: 'https://www.example.com/blog/post',
  title: 'A perfectly reasonable page title here',
  description: 'A description that is long enough to be useful, but not so long that Google cuts it off.',
  siteName: 'Example',
  imageUrl: 'https://example.com/og.jpg',
  twitterSite: 'example',
  ...over,
})
const goodImage: ImageInfo = { status: 'ok', width: 1200, height: 630 }
const ids = (s: Snippet, img: ImageInfo = goodImage, uploaded = false) =>
  runChecks(s, img, { measure: mono, uploaded }).map(c => c.id)

describe('truncateToWidth', () => {
  it('leaves text that fits alone', () => {
    expect(truncateToWidth('short text', 200, '', mono)).toEqual({ text: 'short text', truncated: false, kept: 10 })
  })

  it('cuts at a word boundary and adds an ellipsis', () => {
    const r = truncateToWidth('the quick brown fox jumps over', 200, '', mono)
    expect(r.truncated).toBe(true)
    expect(r.text).toBe('the quick brown ...')
    expect(mono(r.text, '')).toBeLessThanOrEqual(200)
  })

  it('cuts mid-word when the last space is too far back', () => {
    const r = truncateToWidth('a supercalifragilisticexpialidocious', 150, '', mono)
    expect(r.text).toBe('a supercali ...') // 11 chars + " ..." = 150px
  })

  it('never splits emoji', () => {
    const r = truncateToWidth('🍞🍞🍞🍞🍞🍞🍞🍞🍞🍞', 80, '', mono)
    expect(Array.from(r.text.replace(' ...', '')).every(c => c === '🍞')).toBe(true)
  })

  it('normalizes whitespace', () => {
    expect(normalize('  a \n\t b  ')).toBe('a b')
  })
})

describe('parseUrl', () => {
  it('parses a full URL', () => {
    const p = parseUrl('https://www.example.com/blog/caf%C3%A9')
    expect(p.ok && p.domain).toBe('example.com')
    expect(p.ok && p.crumbs).toEqual(['blog', 'café'])
    expect(breadcrumb(p)).toBe('https://www.example.com › blog › café')
  })

  it('assumes https when the protocol is missing', () => {
    const p = parseUrl('example.com/page')
    expect(p.ok && p.assumedProtocol).toBe(true)
  })

  it('rejects junk and other protocols', () => {
    expect(parseUrl('not a url').ok).toBe(false)
    expect(parseUrl('ftp://example.com').ok).toBe(false)
    expect(parseUrl('')).toEqual({ ok: false, empty: true })
  })

  it('shortens long breadcrumbs', () => {
    expect(breadcrumb(parseUrl('https://a.com/1/2/3/4'))).toBe('https://a.com › 1 › 2 › ...')
  })

  it('resolves relative image URLs against the page', () => {
    expect(resolveImageUrl('/img/og.jpg', 'https://a.com/blog/post')).toBe('https://a.com/img/og.jpg')
    expect(resolveImageUrl('', 'https://a.com')).toBeNull()
  })
})

describe('runChecks', () => {
  it('passes a good snippet', () => {
    expect(ids(snippet())).toEqual(['url.ok', 'title.ok', 'description.ok', 'image.ok'])
  })

  it('flags empty and invalid fields', () => {
    const r = ids(snippet({ url: '', title: '', description: '' }), { status: 'none' })
    expect(r).toEqual(['url.empty', 'title.empty', 'description.empty', 'image.none'])
    expect(ids(snippet({ url: 'http://x y' }))).toContain('url.invalid')
    expect(ids(snippet({ url: 'http://example.com' }))).toContain('url.http')
  })

  it('warns about a title Google will cut', () => {
    const long = runChecks(snippet({ title: 'word '.repeat(20) }), goodImage, { measure: mono })
    const c = long.find(x => x.id === 'title.long')
    expect(c?.values?.kept).toBeLessThan(58)
  })

  it('warns about short texts', () => {
    expect(ids(snippet({ title: 'Hi', description: 'Too short.' }))).toEqual(
      expect.arrayContaining(['title.short', 'description.short']),
    )
  })

  it('checks image size, ratio, weight and uploads', () => {
    expect(ids(snippet(), { status: 'ok', width: 150, height: 150 })).toEqual(
      expect.arrayContaining(['image.tiny', 'image.ratio']),
    )
    expect(ids(snippet(), { status: 'ok', width: 400, height: 210 })).toContain('image.small')
    expect(ids(snippet(), { status: 'ok', width: 1200, height: 630, bytes: 6e6 })).toContain('image.heavy')
    expect(ids(snippet(), goodImage, true)).toEqual(expect.arrayContaining(['image.ok', 'image.upload']))
    expect(ids(snippet(), { status: 'error' })).toContain('image.error')
  })
})

describe('buildMetaTags', () => {
  it('builds escaped tags', () => {
    const html = buildMetaTags(snippet({ title: 'Tom & "Jerry" <3' }), { image: goodImage })
    expect(html).toContain('<title>Tom &amp; &quot;Jerry&quot; &lt;3</title>')
    expect(html).toContain('<meta property="og:image:width" content="1200">')
    expect(html).toContain('<meta name="twitter:site" content="@example">')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(html).toContain('<link rel="canonical" href="https://www.example.com/blog/post">')
  })

  it('leaves out empty fields and uses a placeholder for uploads', () => {
    const html = buildMetaTags(snippet({ description: '', twitterSite: '' }), { uploaded: true, uploadPlaceholder: 'PUT-URL-HERE' })
    expect(html).not.toContain('description')
    expect(html).not.toContain('twitter:site')
    expect(html).toContain('content="PUT-URL-HERE"')
  })
})

describe('share links', () => {
  it('round-trips a snippet, including accents and emoji', () => {
    const s = snippet({ title: 'Pan de masa madre 🍞 ñandú', siteName: '' })
    expect(decodeSnippet(encodeSnippet(s))).toEqual(s)
  })

  it('ignores missing or broken data', () => {
    expect(decodeSnippet('')).toBeNull()
    expect(decodeSnippet('#s=%%%')).toBeNull()
    expect(decodeSnippet('#s=bm90IGpzb24')).toBeNull()
  })
})
